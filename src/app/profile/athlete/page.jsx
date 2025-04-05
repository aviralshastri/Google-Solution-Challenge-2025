"use client";

import React, { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MapPin, Phone, User, Edit } from "lucide-react";
import Link from "next/link";

const athleteData = {
  name: "Alex Johnson",
  age: 28,
  weight: "175 lbs",
  gender: "Male",
  city: "Boulder",
  state: "Colorado",
  phone: "(555) 123-4567",
  sports: ["Rock Climbing", "Trail Running", "Mountain Biking", "Swimming"],
  email: "alex.johnson@example.com",
  bio: "Professional athlete with 10+ years of experience in competitive rock climbing and trail running. Multiple-time national champion and passionate about mentoring the next generation of athletes.",
};

export default function AthleteProfile() {
  // Function to handle the edit profile click
  const handleEditClick = () => {
    // Store the athlete data in localStorage
    localStorage.setItem("athleteData", JSON.stringify(athleteData));
  };

  return (
    <div className="flex justify-center py-20">
      <div className="w-full lg:w-5/12">
        <Card className="overflow-hidden">
          <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-primary/40 relative">
            <div className="absolute top-1 right-1">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white shadow-md transition-all duration-200 border border-solid border-gray-200"
                onClick={handleEditClick}
              >
                <Link href="/edit-profile" className="flex items-center gap-2 px-3 py-2">
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

          {/* Increased padding at top to accommodate avatar */}
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
              </TabsContent>
              <TabsContent value="posts" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Recent Training Session</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      No posts yet. Your training sessions and achievements will
                      appear here.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
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