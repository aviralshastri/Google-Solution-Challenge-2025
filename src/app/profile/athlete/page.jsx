"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { doc, getDoc } from "firebase/firestore"
import { getPayloadFromToken } from "@/lib/getTokenPayload"
import { db } from "@/lib/firebase"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MapPin, Phone, User, Edit } from "lucide-react"
import Link from "next/link"

// Import our new components
import AthletePosts from "@/components/custom/post-list"

export default function AthleteProfile() {
  const [athleteData, setAthleteData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cookieData = Cookies.get("userData")

        if (cookieData) {
          const userData = JSON.parse(cookieData)

          const sports = userData.selectedSports?.map((s) => s.label) || []
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
            bio: userData.bio || `User from ${userData.cityName}, passionate about ${sports.join(", ")}`,
          }

          setAthleteData(formatted)
          setLoading(false)
        } else {
          const data = await getPayloadFromToken()
          const uid = data.uid

          const docRef = doc(db, "accounts", uid)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const userData = docSnap.data()
            const sports = userData.selectedSports?.map((s) => s.label) || []

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
              bio: userData.bio || `User from ${userData.cityName}, passionate about ${sports.join(", ")}`,
            }
            Cookies.set("userData", JSON.stringify(userData), {
              expires: 7,
              secure: true,
              sameSite: "Lax",
            })

            setAthleteData(formatted)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!athleteData) return <p className="text-center mt-10">No user data found. Please log in again.</p>

  return (
    <div className="flex justify-center py-20">
      <div className="w-full lg:w-5/12">
        <Card className="overflow-hidden">
          <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-primary/40 relative">
            <div className="absolute top-1 right-1">
              <Button asChild variant="secondary" size="sm">
                <Link href="/edit-profile" className="flex items-center gap-2 px-3 py-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>
            <div className="absolute -bottom-12 left-8">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={athleteData.name} />
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
              <CardTitle className="text-2xl md:text-3xl">{athleteData.name}</CardTitle>
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
                  <InfoItem icon={<User className="h-4 w-4" />} label="Name" value={athleteData.name} />
                  <InfoItem icon={<User className="h-4 w-4" />} label="Age" value={athleteData.age.toString()} />
                  <InfoItem icon={<User className="h-4 w-4" />} label="Weight" value={athleteData.weight} />
                  <InfoItem icon={<User className="h-4 w-4" />} label="Gender" value={athleteData.gender} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="City" value={athleteData.city} />
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="State" value={athleteData.state} />
                  <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={athleteData.phone} />
                  <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={athleteData.email} />
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm font-medium leading-none mb-2">Sports</p>
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
                    <p className="text-sm text-muted-foreground">{athleteData.bio}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="posts" className="mt-6">
                <AthletePosts
                  emptyMessage="No posts yet. Your training sessions and achievements will appear here."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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

