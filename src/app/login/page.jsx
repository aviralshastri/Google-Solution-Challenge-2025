"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/custom/auth-context";

const INVALID_CRED_ERRORS = [
  "auth/invalid-email",
  "auth/user-not-found",
  "auth/wrong-password",
  "auth/invalid-credential",
];

const GoogleLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="mr-2 h-4 w-4"
    aria-hidden="true"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const { login } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    isUnverified: false,
    currentUser: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAuthError = (error) => {
    if (!error || !error.code) {
      setError("An internal server error occurred.");
      return;
    }

    if (INVALID_CRED_ERRORS.includes(error.code)) {
      setDialogContent({
        title: "Invalid Credentials",
        description:
          "The email or password you entered is incorrect. Please try again.",
        isUnverified: false,
      });
      setDialogOpen(true);
      return;
    }

    console.error("Auth error:", error);
    setError("An unexpected error occurred. Please try again.");
  };

  const handleEmailVerification = async (user) => {
    try {
      await sendEmailVerification(user);
      setDialogContent({
        title: "Verification Email Sent",
        description:
          "A verification email has been sent to your inbox. Please check your email and verify your account before logging in.",
        isUnverified: false,
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      setDialogContent({
        title: "Error",
        description:
          "Failed to send verification email. Please try again later.",
        isUnverified: false,
      });
    }
  };

  const getUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "accounts", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("No user document found for this UID");
        return null;
      }

      const userData = userDoc.data();
      return {
        accountType: userData.accountType || "",
        fullName: userData.fullName || "",
        email: userData.email || "",
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const getJwtToken = async (user) => {
    try {
      const userData = await getUserData(user.uid);

      if (!userData) {
        throw new Error("User data not found in database");
      }

      const response = await fetch("/api/auth/token-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          accountType: userData.accountType,
          fullName: userData.fullName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get authentication token");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error getting JWT token:", error);
      throw new Error("Authentication failed. Please try again.");
    }
  };

  const saveTokenToCookie = (token) => {
    Cookies.set("auth_token", token, {
      expires: 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await setPersistence(auth, browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      if (!userCredential.user.emailVerified) {
        setDialogContent({
          title: "Unverified Account",
          description: "Please verify your email before logging in.",
          isUnverified: true,
          currentUser: userCredential.user,
        });
        setDialogOpen(true);
        setIsLoading(false);
        return;
      }

      const token = await getJwtToken(userCredential.user);
      saveTokenToCookie(token);
      login();
      router.push("/");
    } catch (error) {
      console.log(error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeUserData = async (userId, userData) => {
    try {
      await setDoc(doc(db, "accounts", userId), userData);
      return true;
    } catch (error) {
      console.error("Error storing user data:", error);
      alert(`Error storing user data: ${error.message}`);
      return false;
    }
  };
  const verifyUserAccount = async (uid) => {
    try {
      const userDocRef = doc(db, "accounts", uid);
      const userDocSnap = await getDoc(userDocRef);

      return userDocSnap.exists();
    } catch (error) {
      console.error("Error checking user in Firestore:", error);
      throw new Error("Failed to verify user account");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      googleProvider.setCustomParameters({
        prompt: "select_account",
      });

      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);

      const userData = {
        accountType: "athlete",
        fullName: result.user.displayName || "",
        email: result.user.email || "",
        createdAt: new Date(),
      };

      const userExists = await verifyUserAccount(result.user.uid);

      if (!userExists) {
        const minimalUserData = {
          fullName: result.user.displayName || "",
          email: result.user.email || "",
          accountType: "athlete"
        };

        const stored = await storeUserData(result.user.uid, minimalUserData);

        if (stored) {
          console.log("User account created with Google");
        }
      }

      const response = await fetch("/api/auth/token-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: result.user.uid,
          email: userData.email,
          accountType: userData.accountType,
          fullName: userData.fullName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get authentication token");
      }

      const data = await response.json();
      saveTokenToCookie(data.token);
      login();
      router.push("/");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isProcessing = isLoading || isGoogleLoading;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isProcessing}
                className="focus:ring-2 focus:ring-primary"
                aria-describedby="email-error"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isProcessing}
                  className="focus:ring-2 focus:ring-primary pr-10"
                  aria-describedby="password-error"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isProcessing}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full font-medium"
              disabled={isProcessing}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="my-4 flex items-center px-1">
            <Separator className="flex-1" />
            <span className="mx-2 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isProcessing}
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              <>
                <GoogleLogo />
                Continue with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Error/Warning Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center sm:justify-end">
            {dialogContent.isUnverified ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleEmailVerification(dialogContent.currentUser);
                  }}
                >
                  Send Verification Email
                </Button>
              </>
            ) : (
              <Button onClick={() => setDialogOpen(false)}>OK</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
