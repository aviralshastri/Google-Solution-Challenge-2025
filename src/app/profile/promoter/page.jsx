"use client"

import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Mail, MapPin, Phone } from "lucide-react"

const promoterData = {
  name: "Mountain Peak Events",
  address: "123 Summit Drive",
  city: "Denver",
  state: "Colorado",
  zip: "80202",
  phone: "(555) 987-6543",
  email: "info@mountainpeakevents.com",
  eventTypes: ["Trail Races", "Climbing Competitions", "Mountain Festivals", "Outdoor Expos"],
  bio: "Leading outdoor event promoter with over 15 years experience organizing premier competitions and festivals across the Rocky Mountain region. Specializing in sustainable event management and creating memorable experiences for athletes and spectators.",
}

export default function PromoterProfile() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-full lg:w-5/12">
        <Card className="overflow-hidden">
          {/* Banner Image */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-400/20 to-blue-600/40 relative">
            <div className="absolute -bottom-12 left-8">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={promoterData.name} />
                <AvatarFallback>
                  {promoterData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <CardHeader className="pt-20 pb-4">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl md:text-3xl">{promoterData.name}</CardTitle>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {promoterData.city}, {promoterData.state}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {promoterData.eventTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground">{promoterData.bio}</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="private">Private Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="private" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem icon={<Building className="h-4 w-4" />} label="Organization" value={promoterData.name} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="Address" value={promoterData.address} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="City" value={promoterData.city} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="State" value={promoterData.state} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="ZIP" value={promoterData.zip} />
                  <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={promoterData.phone} />
                  <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={promoterData.email} />
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm font-medium leading-none mb-2">Event Types</p>
                    <div className="flex flex-wrap gap-2">
                      {promoterData.eventTypes.map((type) => (
                        <Badge key={type} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm font-medium leading-none mb-2">About</p>
                    <p className="text-sm text-muted-foreground">{promoterData.bio}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contact" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <InfoItem icon={<Building className="h-4 w-4" />} label="Organization" value={promoterData.name} />
                  <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={promoterData.email} />
                  <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={promoterData.phone} />
                  <InfoItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={`${promoterData.city}, ${promoterData.state}`}
                  />
                </div>
              </TabsContent>
              <TabsContent value="posts" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Upcoming Events</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      No events currently scheduled. Check back soon for upcoming competitions and festivals.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper component for displaying info items
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">{icon}</div>
      <div>
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{value}</p>
      </div>
    </div>
  )
}