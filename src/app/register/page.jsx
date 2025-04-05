"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const RegistrationTypeChoose = () => {
  const router = useRouter();

  const handleRegisterAsPromoter = () => {
    router.push("/register/promoter");
  };

  const handleRegisterAsAthlete = () => {
    router.push("/register/athlete");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="shadow-lg w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Join Us Today</CardTitle>
          <CardDescription className="text-center">
            Choose your registration type
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleRegisterAsAthlete}
          >
            Register as Athlete
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleRegisterAsPromoter}
          >
            Register as Promoter
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationTypeChoose;
