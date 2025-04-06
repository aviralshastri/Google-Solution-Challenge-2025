"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getPayloadFromToken } from "@/lib/getTokenPayload"
import MultipleSelector from "@/components/ui/multiple-selector"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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
]

export default function AthleteEditProfile() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    age: 25,
    weight: 70,
    state: "",
    city: "",
    selectedSports: [],
    gender: "",
    bio: "",
  })
  const [originalData, setOriginalData] = useState({})
  const [changedFields, setChangedFields] = useState({})
  const [locationData, setLocationData] = useState({ states: [] })
  const [cities, setCities] = useState([])
  const [formErrors, setFormErrors] = useState({
    phone: "",
    selectedSports: "",
  })
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data from cookies and token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        // Get user data from cookies
        const cookieData = Cookies.get("userData")
        console.log("Raw cookie data:", cookieData)

        let userData = {}
        if (cookieData) {
          userData = JSON.parse(cookieData)
          console.log("Parsed user data from cookies:", userData)
        }

        if (userData) {
          // Create a new object with the user data and default values
          const newFormData = {
            fullName: userData.fullName || "",
            phone: userData.phone || "",
            age: userData.age || 25,
            weight: userData.weight || 70,
            state: userData.stateName || "",
            city: userData.cityName || "",
            selectedSports: userData.selectedSports || [],
            gender: userData.gender || "",
            bio: userData.bio || "",
          }

          console.log("Setting form data to:", newFormData)

          // Set the form data with user data
          setFormData(newFormData)

          // Store original data for comparison
          setOriginalData({ ...newFormData })

          // If state exists, fetch cities for that state
          if (userData.state) {
            fetchCitiesForState(userData.state)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        alert("Failed to load your profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const fetchCitiesForState = async (state) => {
    if (state) {
      try {
        const response = await fetch(`/api/other/get-city?state=${state}`)
        if (!response.ok) {
          throw new Error("Failed to fetch cities")
        }
        const cities = await response.json()
        setCities(cities)
      } catch (error) {
        console.error("Error loading cities:", error)
        setCities([])
      }
    }
  }

  // Track changed fields
  useEffect(() => {
    const newChangedFields = {}

    Object.keys(formData).forEach((key) => {
      // For arrays (like selectedSports), we need to compare differently
      if (Array.isArray(formData[key])) {
        if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
          newChangedFields[key] = formData[key]
        }
      } else if (formData[key] !== originalData[key]) {
        newChangedFields[key] = formData[key]
      }
    })

    setChangedFields(newChangedFields)
    console.log("Changed fields:", newChangedFields)
  }, [formData, originalData])

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("/api/other/get-state")
        if (!response.ok) {
          throw new Error("Failed to fetch states")
        }
        const states = await response.json()
        setLocationData((prev) => ({ ...prev, states }))
      } catch (error) {
        console.error("Error loading states:", error)
      }
    }

    fetchStates()
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.state) {
        try {
          const response = await fetch(`/api/other/get-city?state=${formData.state}`)
          if (!response.ok) {
            throw new Error("Failed to fetch cities")
          }
          const cities = await response.json()
          setCities(cities)
        } catch (error) {
          console.error("Error loading cities:", error)
          setCities([])
        }
      } else {
        setCities([])
      }
    }

    fetchCities()
  }, [formData.state])

  // Validate phone number format
  useEffect(() => {
    if (formData.phone) {
      if (formData.phone.length !== 10) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Phone number must be exactly 10 digits",
        }))
      } else {
        setFormErrors((prev) => ({
          ...prev,
          phone: "",
        }))
      }
    } else {
      setFormErrors((prev) => ({
        ...prev,
        phone: "",
      }))
    }
  }, [formData.phone])

  // Validate selected sports
  useEffect(() => {
    if (formData.selectedSports.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        selectedSports: "Please select at least one sport",
      }))
    } else {
      setFormErrors((prev) => ({
        ...prev,
        selectedSports: "",
      }))
    }
  }, [formData.selectedSports])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "")
      // Limit to 10 digits
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }))
      }
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name, value) => {
    console.log(`Selecting ${name}: ${value}`)
    setFormData((prev) => {
      if (name === "state") {
        return { ...prev, [name]: value, city: "" }
      }
      return { ...prev, [name]: value }
    })
  }, [])

  const handleSliderChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, age: value[0] }))
  }, [])

  const handleSportsChange = useCallback((selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      selectedSports: selectedOptions,
    }))
  }, [])

  const isFormValid = useMemo(() => {
    return formData.selectedSports.length > 0 && formData.phone.length === 10 && formData.gender !== ""
  }, [formData.selectedSports, formData.phone, formData.gender])

  const hasChanges = Object.keys(changedFields).length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = {}

    if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits"
    }

    if (formData.selectedSports.length === 0) {
      errors.selectedSports = "Please select at least one sport"
    }

    setFormErrors((prev) => ({ ...prev, ...errors }))

    if (Object.keys(errors).length > 0 || !isFormValid || !hasChanges) {
      return
    }

    try {
      setLoading(true)

      // Get UID from token
      const tokenData = await getPayloadFromToken()
      const uid = tokenData.uid

      console.log("User ID from token:", uid)
      console.log("Updating fields:", changedFields)

      if (!uid) {
        throw new Error("User ID not found")
      }

      // Update only changed fields in Firestore
      const userDocRef = doc(db, "accounts", uid)
      await updateDoc(userDocRef, changedFields)

      // Update cookie data
      const cookieData = Cookies.get("userData")
      const userData = cookieData ? JSON.parse(cookieData) : {}

      // Update only changed fields in cookie data
      const updatedUserData = { ...userData, ...changedFields }
      Cookies.set("userData", JSON.stringify(updatedUserData))

      console.log("Updated user data in cookies:", updatedUserData)

      // Update original data to reflect the new state
      setOriginalData({ ...formData })
      setChangedFields({})

      alert("Your profile has been updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert(`Failed to update profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 px-4 py-20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
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
              {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="age">Age: {formData.age}</Label>
              <Slider
                id="age"
                min={18}
                max={80}
                step={1}
                value={[formData.age]}
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
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="gender">Gender</Label>
              <RadioGroup
                id="gender"
                name="gender"
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
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
                    onValueChange={(value) => handleSelectChange("state", value)}
                    value={formData.state}
                    defaultValue={formData.state}
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
                    defaultValue={formData.city}
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
                emptyIndicator={<p className="text-center text-lg leading-10">no results found.</p>}
                onChange={handleSportsChange}
                value={formData.selectedSports}
              />
              {formErrors.selectedSports && <p className="mt-1 text-xs text-red-500">{formErrors.selectedSports}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={!isFormValid || loading || !hasChanges}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

