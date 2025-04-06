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
      title: "Professional Marathon Runner",
      profileImage: "/profile_emma.jpg",
    },
    content:
      "Finished a solid 18-mile training run this morning! Boston Marathon prep is going strong 🏃‍♀️🔥\n\nRunning long distances is as much a mental game as it is physical. There were moments I wanted to quit, especially around mile 14, but pushing through that wall is what makes the difference on race day. I’m tracking nutrition, sleep, and mental health just as closely as pace and mileage now. Excited for what’s ahead!",
    image: "/p1.jpg",
    likes: 134,
    shares: 12,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Alex Rodriguez",
      title: "Olympic Swimmer | 2x Gold Medalist",
      profileImage: "/profile_alex.jpg",
    },
    content:
      "Back in the pool after a 2-week break. Feeling refreshed and ready to crush this season. 🏊‍♂️💪\n\nRecovery is just as important as training — my coach always emphasizes that. These past two weeks helped me reset both physically and mentally. Now it’s all about refining my turns and working on my underwater dolphin kicks. Let’s make this season unforgettable!",
    image: "/p2.jpg",
    likes: 210,
    shares: 19,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    author: {
      name: "Sarah Kim",
      title: "National Gymnast | Team USA",
      profileImage: "/profile_sarah.jpg",
    },
    content:
      "Landed my first ever double layout on beam today! Months of hard work finally paying off. 🌟\n\nBeam has always been my most challenging apparatus — the precision and focus it demands are unreal. I've been practicing this move for nearly six months, and finally hitting it clean in training brought me to tears. Shoutout to my coaches and teammates for never letting me give up. Next step: competition-ready!",
    image: "/p3.jpg",
    likes: 356,
    shares: 44,
    timestamp: "1 day ago",
  },
  {
    id: 4,
    author: {
      name: "Jordan Lee",
      title: "High School Basketball Prospect | Class of 2026",
      profileImage: "/profile_jordan.jpg",
    },
    content:
      "Dropped 30 pts, 12 rebounds, and 7 assists last night 💯 Grinding every day to earn that D1 offer!\n\nThis game was special — it was against a rival school and the gym was packed. The energy from the crowd kept me going even when I was gassed in the 4th quarter. All those early morning workouts and late-night film sessions are starting to show. Staying locked in and focused on the dream.",
    image: "/p4.jpg",
    likes: 97,
    shares: 15,
    timestamp: "10 hours ago",
  },
  {
    id: 5,
    author: {
      name: "Ava Martinez",
      title: "Fitness Coach | Former Pro Soccer Player",
      profileImage: "/profile_ava.jpg",
    },
    content:
      "Today's focus: agility & explosive strength. Never stop pushing your limits. 💥⚽️\n\nI ran a full-body circuit for my athletes that centered around fast feet, resistance band work, and plyometric drills. We’re building not just bodies but confidence, discipline, and a relentless mindset. Remember, the small wins in training are what lead to the big wins in life. Stay consistent and trust the process.",
    image: "/p5.jpg",
    likes: 176,
    shares: 21,
    timestamp: "3 hours ago",
  },
];

export default function Home() {
  return (
    <div className="w-full flex justify-center min-h-screen py-8 px-2">
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
