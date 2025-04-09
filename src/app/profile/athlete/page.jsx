"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getPayloadFromToken } from "@/lib/getTokenPayload";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getAuth, deleteUser } from "firebase/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MapPin, Phone, User, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import AthletePosts from "@/components/custom/post-list";
import { useAuth } from "@/components/custom/auth-context";
import { Plus } from "lucide-react";

export default function AthleteProfile() {
  const [athleteData, setAthleteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileRedirectTriggered, setProfileRedirectTriggered] =
    useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const hasIncompleteProfile = (userData) => {
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

    for (const field of requiredFields) {
      if (
        !userData[field] ||
        (typeof userData[field] === "string" &&
          userData[field].trim() === "") ||
        (field === "selectedSports" &&
          (!Array.isArray(userData[field]) || userData[field].length === 0))
      ) {
        console.log(`Incomplete profile: Missing ${field}`);
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        const data = await getPayloadFromToken();
        const uid = data.uid;

        if (!uid || !isMounted) return;

        const docRef = doc(db, "accounts", uid);
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log(userData);

          // Check if profile is incomplete
          if (hasIncompleteProfile(userData) && !profileRedirectTriggered) {
            setProfileRedirectTriggered(true);
            alert(
              "Your profile is incomplete. Please complete your profile first, then continue using the application with ease."
            );
            router.push("/edit-profile");
            return;
          }

          // Only process the data if we're not redirecting
          if (!hasIncompleteProfile(userData)) {
            const sports = userData.selectedSports?.map((s) => s.label) || [];
            const formatted = {
              name: userData.fullName,
              age: userData.age,
              weight: `${userData.weight} kg`,
              gender: userData.gender,
              city: userData.city,
              state: userData.state,
              phone: userData.phone,
              email: userData.email,
              sports,
              bio:
                userData.bio ||
                `User from ${userData.city}, passionate about ${sports.join(
                  ", "
                )}`,
            };

            setAthleteData(formatted);
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [router, profileRedirectTriggered]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is currently signed in");
        return;
      }

      const data = await getPayloadFromToken();
      const uid = data.uid;

      await deleteDoc(doc(db, "accounts", uid));
      await deleteUser(user);

      logout();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);

      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-center">
              Loading your profile...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!athleteData)
    return (
      <div className="flex justify-center py-20 px-2">
        <Card className="w-full lg:w-5/12 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-lg font-medium">
              No user data found. Please log in again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  return (
    <div className="flex justify-center py-20 px-2">
      <div className="w-full lg:w-5/12">
        <Card className="overflow-hidden">
          <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-primary/40 relative">
            <div className="absolute top-1 right-1">
              <Button asChild variant="secondary" size="sm">
                <Link
                  href="/edit-profile"
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>
            <div className="absolute -bottom-12 left-8">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt={athleteData.name}
                />
                <AvatarFallback>
                  {athleteData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <CardHeader className="pt-20 pb-4">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl md:text-3xl">
                {athleteData.name}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {athleteData.city}, {athleteData.state}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {athleteData.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground">{athleteData.bio}</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label="Name"
                    value={athleteData.name}
                  />
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label="Age"
                    value={athleteData.age.toString()}
                  />
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label="Weight"
                    value={athleteData.weight}
                  />
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label="Gender"
                    value={athleteData.gender}
                  />
                  <InfoItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="City"
                    value={athleteData.city}
                  />
                  <InfoItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="State"
                    value={athleteData.state}
                  />
                  <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={athleteData.phone}
                  />
                  <InfoItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={athleteData.email}
                  />
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm font-medium leading-none mb-2">
                      Sports
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {athleteData.sports.map((sport) => (
                        <Badge key={sport} variant="outline">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm font-medium leading-none mb-2">Bio</p>
                    <p className="text-sm text-muted-foreground">
                      {athleteData.bio}
                    </p>
                  </div>
                </div>
                <Separator />
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </TabsContent>
              <TabsContent value="posts" className="mt-6">
                <div className="flex justify-end mb-4">
                  <Link
                    href={"/create-post"}
                    className="px-4 py-2 border border-solid rounded-full flex flex-row items-center gap-1 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={18} color="black"/>
                    <span className="text-black font-bold">Create Post</span>
                  </Link>
                </div>
                <AthletePosts emptyMessage="No posts yet." />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}
