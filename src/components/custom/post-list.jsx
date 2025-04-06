"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getPayloadFromToken } from "@/lib/getTokenPayload"

function PostCard({ post }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const hasImages = post.images && post.images.length > 0
  const hasMultipleImages = hasImages && post.images.length > 1
  const hasTags = post.tags && post.tags.length > 0

  const nextImage = () => {
    if (!hasMultipleImages) return
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    if (!hasMultipleImages) return
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>
      </CardHeader>

      {hasImages && (
        <div className="relative">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={post.images[currentImageIndex].url || "/placeholder.svg?height=450&width=800"}
              alt={post.images[currentImageIndex].alt || post.title}
              fill
              className="object-cover"
            />
          </div>

          {hasMultipleImages && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {post.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full ${idx === currentImageIndex ? "w-4 bg-primary" : "w-1.5 bg-muted"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <CardContent className="pt-4 space-y-3">
        <p className="text-muted-foreground">{post.description}</p>

        {hasTags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Posts Component
export default function AthletePosts({
  emptyMessage = "No posts yet. Your training sessions and achievements will appear here.",
}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Get user UID from token
        const data = await getPayloadFromToken()
        const uid = data.uid

        if (!uid) {
          setError("User ID not found. Please log in again.")
          setLoading(false)
          return
        }

        // Create query to get posts by user UID, ordered by creation time (newest first)
        const postsRef = collection(db, "posts")
        const postsQuery = query(postsRef, where("uid", "==", uid), orderBy("createdAt", "desc"))

        // Execute query
        const querySnapshot = await getDocs(postsQuery)

        // Format posts data
        const postsData = querySnapshot.docs.map((doc) => {
          const data = doc.data()

          // Format timestamp to readable date
          let date = "Unknown date"
          if (data.createdAt) {
            // Handle Firestore timestamp
            const timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)

            date = timestamp.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }

          // Format images if they exist
          const images =
            data.images && data.images.length > 0 ? data.images.map((url) => ({ url, alt: data.title })) : undefined

          return {
            id: doc.id,
            title: data.title || "Untitled Post",
            description: data.description || "",
            date,
            images,
            tags: data.tags || [],
          }
        })

        setPosts(postsData)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("Failed to load posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="rounded-lg border p-4 text-center">
        <p>Loading your posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="font-medium">Your Posts</h3>
        <p className="text-sm text-muted-foreground mt-2">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

