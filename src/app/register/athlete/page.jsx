"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import MultipleSelector from "@/components/ui/multiple-selector";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const OPTIONS = [
  { label: "Track & Field", value: "track_field" },
  { label: "Marathon", value: "marathon" },
  { label: "Cycling", value: "cycling" },
  { label: "Swimming", value: "swimming" },
  { label: "Triathlon", value: "triathlon" },
  { label: "Gymnastics", value: "gymnastics" },
  { label: "Wrestling", value: "wrestling" },
  { label: "Weightlifting", value: "weightlifting" },
  { label: "Rowing", value: "rowing" },
  { label: "CrossFit", value: "crossfit" },
];

export default function AthleteRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: 25,
    weight: 70,
    accountType: "athlete",
    state: "",
    city: "",
    password: "",
    confirmPassword: "",
    selectedSports: [],
    gender: "",
    profile: "",
    banner: "",
    bio: "",
  });
  const [locationData, setLocationData] = useState({ states: [] });
  const [cities, setCities] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formErrors, setFormErrors] = useState({
    phone: "",
    selectedSports: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("/api/other/get-state");
        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }
        const states = await response.json();
        setLocationData((prev) => ({ ...prev, states }));
      } catch (error) {
        console.error("Error loading states:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.state) {
        try {
          const response = await fetch(
            `/api/other/get-city?state=${formData.state}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch cities");
          }
          const cities = await response.json();
          setCities(cities);
        } catch (error) {
          console.error("Error loading cities:", error);
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [formData.state]);

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  const checkPasswordStrength = useCallback((password) => {
    const errors = [];
    let strength = 0;

    if (password.length > 0) {
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
      } else {
        strength += 25;
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("Include at least one uppercase letter");
      } else {
        strength += 25;
      }

      if (!/\d/.test(password)) {
        errors.push("Include at least one number");
      } else {
        strength += 25;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Include at least one special character");
      } else {
        strength += 25;
      }
    }

    return { strength, errors };
  }, []);

  useEffect(() => {
    const { strength, errors } = checkPasswordStrength(formData.password);
    setPasswordStrength(strength);
    setPasswordErrors(errors);
  }, [formData.password, checkPasswordStrength]);

  // Validate phone number format
  useEffect(() => {
    if (formData.phone) {
      if (formData.phone.length !== 10) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Phone number must be exactly 10 digits",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          phone: "",
        }));
      }
    } else {
      setFormErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  }, [formData.phone]);

  // Validate selected sports
  useEffect(() => {
    if (formData.selectedSports.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        selectedSports: "Please select at least one sport",
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        selectedSports: "",
      }));
    }
  }, [formData.selectedSports]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      // Limit to 10 digits
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => {
      if (name === "state") {
        return { ...prev, [name]: value, city: "" };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleSliderChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, age: value[0] }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleSportsChange = useCallback((selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      selectedSports: selectedOptions,
    }));
  }, []);

  const getPasswordStrengthLabel = useCallback(() => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  }, [passwordStrength]);

  const getPasswordStrengthColor = useCallback(() => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  }, [passwordStrength]);

  const isFormValid = useMemo(() => {
    return (
      passwordsMatch &&
      passwordStrength >= 50 &&
      formData.selectedSports.length > 0 &&
      formData.phone.length === 10 &&
      formData.gender !== ""
    );
  }, [
    passwordsMatch,
    passwordStrength,
    formData.selectedSports,
    formData.phone,
    formData.gender,
  ]);

  // Store user data in Firestore
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

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        fullName: user.displayName || "",
        email: user.email || "",
        phone: "",
        age: 25,
        weight: 70,
        accountType: "athlete",
        state: "",
        city: "",
        selectedSports: [],
        gender: "", // Add gender field
        createdAt: new Date(),
        photoURL: user.photoURL || "",
      };

      const stored = await storeUserData(user.uid, userData);

      if (stored) {
        alert("Registration successful with Google!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert(`Error signing in with Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (formData.selectedSports.length === 0) {
      errors.selectedSports = "Please select at least one sport";
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));

    if (Object.keys(errors).length > 0 || !isFormValid) {
      return;
    }

    try {
      setLoading(true);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Prepare user data for Firestore (excluding password and confirmPassword)
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        weight: formData.weight,
        accountType: formData.accountType,
        state: formData.state,
        city: formData.city,
        selectedSports: formData.selectedSports,
        gender: formData.gender, // Add gender field
        createdAt: new Date(),
        emailVerified: false,
      };

      // Store in Firestore using Auth UID as document ID
      const stored = await storeUserData(user.uid, userData);

      if (stored) {
        // Send verification email
        await sendEmailVerification(user);

        alert(
          "Registration successful! Please check your email to verify your account."
        );
        router.push("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Error registering with email/password:", error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 px-4 py-20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number (10 digits)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="9XXXXXXXX2"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                inputMode="numeric"
                maxLength={10}
                required
              />
              {formErrors.phone && (
                <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="age">Age: {formData.age}</Label>
              <Slider
                id="age"
                min={18}
                max={80}
                step={1}
                defaultValue={[formData.age]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min={30}
                max={200}
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="gender">Gender</Label>
              <RadioGroup
                id="gender"
                name="gender"
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                className="flex space-x-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Address</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("state", value)
                    }
                    value={formData.state}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationData.states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Select
                    onValueChange={(value) => handleSelectChange("city", value)}
                    value={formData.city}
                    disabled={!formData.state}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Select your interested sports (required)</Label>
              <MultipleSelector
                defaultOptions={OPTIONS}
                placeholder="Select sports you like..."
                emptyIndicator={
                  <p className="text-center text-lg leading-10">
                    no results found.
                  </p>
                }
                onChange={handleSportsChange}
                value={formData.selectedSports}
              />
              {formErrors.selectedSports && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.selectedSports}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {formData.password && (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">
                      Password strength: {getPasswordStrengthLabel()}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-1" />

                  {passwordErrors.length > 0 && (
                    <ul className="mt-1 text-xs text-red-500">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {!passwordsMatch && formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || loading}
            >
              {loading ? "Processing..." : "Register"}
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
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="mr-2 h-4 w-4"
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
            {loading ? "Processing..." : "Continue with Google"}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}