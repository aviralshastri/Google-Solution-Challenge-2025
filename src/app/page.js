import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share2, ThumbsUp } from "lucide-react";

const posts = [
  {
    id: 1,
    author: {
      name: "Emma Johnson",
      title: "Software Engineer at Tech Innovations",
      profileImage: "/profile.jpg",
    },
    content:
      "Just completed an exciting project using Next.js and shadcn/ui! Loving the clean, modern design approach.",
    image: "https://picsum.photos/600/500",
    likes: 42,
    shares: 5,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Alex Rodriguez",
      title: "Product Manager",
      profileImage: "/profile.jpg",
    },
    content:
      "Exploring new ways to improve user experience and streamline product development workflows.",
    image: "https://picsum.photos/600/500",
    likes: 28,
    shares: 3,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    author: {
      name: "Sarah Kim",
      title: "UX Designer",
      profileImage: "/profile.jpg",
    },
    content:
      "Design is not just about how it looks, but how it works. Always striving to create intuitive experiences.",
    image: "https://picsum.photos/600/500",
    likes: 65,
    shares: 7,
    timestamp: "1 day ago",
  },
  {
    id: 4,
    author: {
      name: "Sarah Kim",
      title: "UX Designer",
      profileImage: "/profile.jpg",
    },
    content:
      "Design is not just about how it looks, but how it works. Always striving to create intuitive experiences.",
    image: "https://picsum.photos/600/500",
    likes: 65,
    shares: 7,
    timestamp: "1 day ago",
  },
  {
    id: 5,
    author: {
      name: "Sarah Kim",
      title: "UX Designer",
      profileImage: "/profile.jpg",
    },
    content:
      "Design is not just about how it looks, but how it works. Always striving to create intuitive experiences.",
    image: "https://picsum.photos/600/500",
    likes: 65,
    shares: 7,
    timestamp: "1 day ago",
  },
];

export default function Home() {
  return (
    <div className="w-full flex justify-center min-h-screen py-8">
      <div className="w-full lg:w-5/12 space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="w-full border-none shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl group"
          >
            <CardHeader className="p-4 pb-0 flex flex-row items-center space-x-4">
              <Avatar className="w-12 h-12 border-2 border-transparent group-hover:border-primary/20 transition-all">
                <AvatarImage
                  src={post.author.profileImage}
                  alt={post.author.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight">
                      {post.author.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {post.author.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <p className="px-4 text-sm text-foreground leading-relaxed">
                {post.content}
              </p>

              {post.image && (
                <div className="w-full aspect-video relative overflow-hidden">
                  <Image
                    alt="img-placeholder"
                    src={post.image}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex justify-between p-4 pt-2 border-t">
                <div className="flex items-center space-x-2 group/likes">
                  <ThumbsUp
                    size={18}
                    className="text-muted-foreground group-hover/likes:text-primary transition-colors"
                  />
                  <span className="text-sm text-muted-foreground group-hover/likes:text-primary transition-colors">
                    {post.likes} Likes
                  </span>
                </div>
                <div className="flex items-center space-x-2 group/shares">
                  <Share2
                    size={18}
                    className="text-muted-foreground group-hover/shares:text-primary transition-colors"
                  />
                  <span className="text-sm text-muted-foreground group-hover/shares:text-primary transition-colors">
                    {post.shares} Shares
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
