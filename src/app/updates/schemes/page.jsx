"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileTextIcon, Users2Icon, CalendarIcon } from "lucide-react";

export default function Schemes() {
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Dummy schemes data
  const schemes = [
    {
      id: 1,
      title: "Elite Athlete Development Program",
      description:
        "A comprehensive program designed to identify and nurture elite athletic talent through specialized training, coaching, and support services.",
      tags: ["Elite", "Development", "National"],
      image: "/schemes-placeholder.jpg",
      eligibility: "National level athletes aged 16-25",
      duration: "3 years with annual assessment",
      provider: "National Sports Development Authority",
      benefits:
        "Monthly stipend, training facilities access, medical support, competition funding",
      url: "https://nsda.org/elite-program",
    },
    {
      id: 2,
      title: "Community Athletics Grant",
      description:
        "Financial support for local communities to develop athletics infrastructure, organize events, and promote grassroots participation in athletics.",
      tags: ["Community", "Funding", "Infrastructure"],
      image: "/schemes-placeholder.jpg",
      eligibility: "Registered community organizations and local authorities",
      duration: "1-year funding cycle",
      provider: "Sports Community Foundation",
      benefits:
        "Grants up to $25,000, technical assistance, equipment provision",
      url: "https://sportscommunity.org/grants",
    },
    {
      id: 3,
      title: "Para-Athletics Inclusion Initiative",
      description:
        "A nationwide scheme promoting inclusive athletics for people with disabilities through adapted equipment, specialized coaching, and accessible facilities.",
      tags: ["Para-Athletics", "Inclusion", "Accessibility"],
      image: "/schemes-placeholder.jpg",
      eligibility: "Athletes with disabilities, sports clubs, schools",
      duration: "Ongoing program with quarterly intake",
      provider: "Paralympic Athletics Association",
      benefits:
        "Adaptive equipment, specialized coaching, facility modifications, event funding",
      url: "https://paraathletics.org/inclusion",
    },
    {
      id: 4,
      title: "Youth Athletics Scholarship",
      description:
        "Educational scholarships for talented young athletes to balance their academic pursuits with athletic development and competitive opportunities.",
      tags: ["Youth", "Education", "Scholarship"],
      image: "/schemes-placeholder.jpg",
      eligibility:
        "Student-athletes aged 14-18 with proven athletics achievement",
      duration: "Throughout secondary education",
      provider: "Athletics Education Foundation",
      benefits:
        "Tuition support, flexible academic scheduling, coaching, competition expenses",
      url: "https://athleticseducation.org/scholarships",
    },
    {
      id: 5,
      title: "Rural Athletics Outreach",
      description:
        "A targeted initiative to discover and develop athletic talent in underserved rural communities through mobile coaching units and rural sports hubs.",
      tags: ["Rural", "Outreach", "Talent Identification"],
      image: "/schemes-placeholder.jpg",
      eligibility: "Rural communities with limited sports infrastructure",
      duration: "2-year program with extension options",
      provider: "Athletics for All Foundation",
      benefits:
        "Mobile coaching, equipment provision, facility development, talent pathways",
      url: "https://athleticsforall.org/rural",
    },
    {
      id: 6,
      title: "Coaching Excellence Program",
      description:
        "Professional development scheme for athletics coaches at all levels to enhance their skills, knowledge, and qualifications through structured training and mentorship.",
      tags: ["Coaching", "Professional Development", "Certification"],
      image: "/schemes-placeholder.jpg",
      eligibility: "Active coaches with minimum Level 1 certification",
      duration: "12-month development pathway",
      provider: "National Coaching Institute",
      benefits:
        "Advanced certifications, workshops, mentorship, international exposure",
      url: "https://nationalcoaching.org/excellence",
    },
  ];

  const openDialog = (scheme) => {
    setSelectedScheme(scheme);
  };

  const closeDialog = () => {
    setSelectedScheme(null);
  };

  return (
    <div className="container mx-auto">
      <div className="py-20 px-2 flex flex-col space-y-6 items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Athletics Schemes
        </h1>
        {schemes.map((scheme) => (
          <Card
            key={scheme.id}
            className="w-full lg:w-5/12 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => openDialog(scheme)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={scheme.image}
                alt={scheme.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{scheme.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                <FileTextIcon className="h-4 w-4" />
                <span>Provided by {scheme.provider}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">
                {scheme.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {scheme.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedScheme} onOpenChange={closeDialog}>
        {selectedScheme && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
            <div className="overflow-y-auto px-1">
              <div className="w-full aspect-video mb-4 overflow-hidden rounded-md">
                <img
                  src={selectedScheme.image}
                  alt={selectedScheme.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <DialogTitle>{selectedScheme.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Provided by {selectedScheme.provider}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">{selectedScheme.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Users2Icon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Eligibility:</strong> {selectedScheme.eligibility}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Duration:</strong> {selectedScheme.duration}
                    </span>
                  </div>
                  <div className="mt-2">
                    <strong>Benefits:</strong>
                    <p className="mt-1">{selectedScheme.benefits}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedScheme.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button asChild>
                <a
                  href={selectedScheme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore More
                </a>
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
