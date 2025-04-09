"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, X, Loader2 } from "lucide-react";
import MultipleSelector from "@/components/ui/multiple-selector";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getPayloadFromToken } from "@/lib/getTokenPayload";

const OPTIONS = [
  { label: "Training", value: "training" },
  { label: "Nutrition", value: "nutrition" },
  { label: "Injury Recovery", value: "injury-recovery" },
  { label: "Competitions", value: "competitions" },
  { label: "Mental Health", value: "mental-health" },
  { label: "Coaching", value: "coaching" },
  { label: "Sponsorship", value: "sponsorship" },
  { label: "Networking", value: "networking" },
  { label: "Career Advice", value: "career-advice" },
  { label: "Workout Plans", value: "workout-plans" },
  { label: "Athlete Stories", value: "athlete-stories" },
  { label: "Recruitment", value: "recruitment" },
  { label: "Fitness Tech", value: "fitness-tech" },
  { label: "Motivation", value: "motivation" },
];

const requiredFields = [
  "fullName",
  "age",
  "weight",
  "gender",
  "city",
  "state",
  "phone",
  "email",
  "selectedSports",
];

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [userAvatar, setUserAvatar] = useState("/placeholder.svg?height=40&width=40");
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getPayloadFromToken();
        if (data) {
          setUserId(data.uid);
          
          // Default values from token
          let defaultName = data.fullName || "";
          let defaultEmail = data.email || "";
          
          try {
            const userDocRef = doc(db, "accounts", data.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              // Use data from DB if available, fallback to token data
              setUserName(userData.fullName || defaultName);
              setUserHandle("@" + (userData.email || defaultEmail));
              
              if (userData.profilePicture) {
                setUserAvatar(userData.profilePicture);
              }
              
              // Check if profile is complete
              const isComplete = checkProfileComplete(userData);
              setIsProfileComplete(isComplete);
              
              if (!isComplete) {
                setShowProfileAlert(true);
              }
            } else {
              // Document doesn't exist, use token data
              setUserName(defaultName);
              setUserHandle("@" + defaultEmail);
              
              // Profile is incomplete if document doesn't exist
              setIsProfileComplete(false);
              setShowProfileAlert(true);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback to token data
            setUserName(defaultName);
            setUserHandle("@" + defaultEmail);
            
            setIsProfileComplete(false);
            setShowProfileAlert(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert(
          "error",
          "Authentication Error",
          "Please sign in to create a post"
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    fetchUserData();
  }, [router]);

  const checkProfileComplete = (userData) => {
    for (const field of requiredFields) {
      if (!userData[field] || 
          (Array.isArray(userData[field]) && userData[field].length === 0) ||
          (typeof userData[field] === 'string' && userData[field].trim() === '')) {
        return false;
      }
    }
    return true;
  };

  const showAlert = (type, title, message) => {
    setAlert({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setAlert({ show: false, type: "", title: "", message: "" });
    }, 5000);
  };

  const handleRedirectToProfile = () => {
    router.push("/edit-profile");
  };

  const handleImageUpload = (e) => {
    if (!isProfileComplete) {
      setShowProfileAlert(true);
      return;
    }
    
    if (e.target && e.target.files && e.target.files.length > 0) {
      setIsLoading(true);

      const files = Array.from(e.target.files);
      
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 10 * 1024 * 1024; 
        return isValidType && isValidSize;
      });
      
      if (validFiles.length !== files.length) {
        showAlert(
          "error",
          "Invalid Files",
          "Some files were rejected. Please ensure all files are images under 5MB."
        );
      }
      
      if (validFiles.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const totalImages = imageFiles.length + validFiles.length;
      if (totalImages > 10) {
        showAlert(
          "error",
          "Too Many Images",
          "You can only upload a maximum of 10 images per post."
        );
        const allowedNewFiles = validFiles.slice(0, 10 - imageFiles.length);
        setImageFiles((prevFiles) => [...prevFiles, ...allowedNewFiles]);
        
        const newImagePreviews = allowedNewFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls((prevUrls) => [...prevUrls, ...newImagePreviews]);
      } else {
        setImageFiles((prevFiles) => [...prevFiles, ...validFiles]);
        
        const newImagePreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls((prevUrls) => [...prevUrls, ...newImagePreviews]);
      }

      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    const newImagePreviews = [...imagePreviewUrls];
    URL.revokeObjectURL(newImagePreviews[index]);
    newImagePreviews.splice(index, 1);
    setImagePreviewUrls(newImagePreviews);
  };

  const uploadImagesToStorage = async () => {
    if (imageFiles.length === 0) return [];

    const storage = getStorage();
    const imageUrls = [];

    for (const file of imageFiles) {
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop();
      const randomString = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      const fileName = `${userId}/${timestamp}-${randomString}.${fileExtension}`;

      const storageRef = ref(storage, `posts/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      imageUrls.push(downloadUrl);
    }

    return imageUrls;
  };

  const handlePublish = async () => {
    if (!isProfileComplete) {
      setShowProfileAlert(true);
      return;
    }
    
    if (!title.trim()) {
      showAlert("error", "Missing Title", "Please add a title to your post");
      return;
    }

    if (!postContent.trim()) {
      showAlert(
        "error",
        "Missing Content",
        "Please add some content to your post"
      );
      return;
    }

    if (selectedTags.length === 0) {
      showAlert("error", "Missing Tags", "Please select at least one tag");
      return;
    }

    if (!userId) {
      showAlert(
        "error",
        "Authentication Error",
        "User ID not available. Please try again later"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToStorage();
      }

      const sanitizedTitle = title.trim();
      const sanitizedContent = postContent.trim();
      
      const postData = {
        title: sanitizedTitle,
        description: sanitizedContent,
        tags: selectedTags.map((tag) => tag.value),
        uid: userId,
        createdAt: serverTimestamp(),
      };

      if (imageUrls.length > 0) {
        postData.images = imageUrls;
      }

      const docRef = await addDoc(collection(db, "posts"), postData);

      showAlert(
        "success",
        "Post Published",
        "Your post has been published successfully!"
      );
      
      setTitle("");
      setPostContent("");
      setImageFiles([]);
      setImagePreviewUrls([]);
      setSelectedTags([]);
      
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error adding document: ", error);
      showAlert("error", "Publish Error", "Failed to publish your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20 p-4 min-h-screen items-center justify-center">
      {alert.show && (
        <Alert
          className={`mb-4 ${
            alert.type === "error"
              ? "bg-red-50 text-red-900 border-red-200"
              : "bg-green-50 text-green-900 border-green-200"
          }`}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      
      {/* Persistent profile completion warning */}
      {!isProfileComplete && (
        <Alert className="mb-4 bg-red-50 text-red-900 border-red-200">
          <AlertTitle>Profile Incomplete</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>You need to complete your profile before creating a post.</span>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleRedirectToProfile}
              className="mt-2 sm:mt-0"
            >
              Complete Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {showProfileAlert && (
        <AlertDialog open={showProfileAlert} onOpenChange={setShowProfileAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Your Profile</AlertDialogTitle>
              <AlertDialogDescription>
                You need to complete your profile before creating a post. Would you like to go to your profile page now?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRedirectToProfile}>Yes, Complete Profile</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-4 mb-4">
            <div className="flex flex-row items-center space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={userAvatar}
                  alt={userName}
                />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-md">{userName}</h1>
                <p className="font-light text-sm text-muted-foreground">
                  {userHandle}
                </p>
              </div>
            </div>

            <Input
              placeholder="Add a title..."
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={!isProfileComplete}
            />

            <Textarea
              placeholder="What do you want to talk about?"
              className="min-h-[120px] resize-none"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              maxLength={5000}
              disabled={!isProfileComplete}
            />

            <MultipleSelector
              defaultOptions={OPTIONS}
              placeholder="Add tags... (required)"
              creatable
              value={selectedTags}
              onChange={setSelectedTags}
              disabled={!isProfileComplete}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center mt-4 mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Processing images...
              </span>
            </div>
          )}

          {imagePreviewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {imagePreviewUrls.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-md overflow-hidden"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Attached image ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                    aria-label="Remove image"
                    disabled={!isProfileComplete}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={!isProfileComplete}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isProfileComplete) {
                  fileInputRef.current?.click();
                } else {
                  setShowProfileAlert(true);
                }
              }}
              disabled={isLoading || isSubmitting || imageFiles.length >= 10 || !isProfileComplete}
              aria-label="Add image"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image {imageFiles.length > 0 ? `(${imageFiles.length}/10)` : ""}
                </>
              )}
            </Button>
          </div>
          <Button
            onClick={handlePublish}
            disabled={
              !isProfileComplete ||
              !title.trim() ||
              !postContent.trim() ||
              selectedTags.length === 0 ||
              isLoading ||
              isSubmitting
            }
            aria-label="Publish post"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}