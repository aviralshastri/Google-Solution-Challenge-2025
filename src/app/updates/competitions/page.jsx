"use client"

import React, { useState } from 'react';
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

export default function Competitions() {
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  
  // Dummy competition data
  const competitions = [
    {
      id: 1,
      title: "World Athletics Championship 2025",
      description: "The premier global athletics competition featuring top athletes from around the world competing in track and field events.",
      tags: ["International", "Track & Field", "Championship"],
      image: "/competitions-placeholder.jpg",
      publisher: "World Athletics",
      url: "https://worldathletics.org"
    },
    {
      id: 2,
      title: "National Cross Country Series",
      description: "A nationwide cross country running series with events held across multiple cities throughout the season.",
      tags: ["National", "Cross Country", "Series"],
      image: "/competitions-placeholder.jpg",
      publisher: "National Athletics Association",
      url: "https://nationalathletics.org"
    },
    {
      id: 3,
      title: "Marathon Majors: Berlin",
      description: "One of the prestigious world marathon majors held annually on the streets of Berlin, known for its fast course and record times.",
      tags: ["Marathon", "Road Race", "Elite"],
      image: "/competitions-placeholder.jpg",
      publisher: "Berlin Marathon Organization",
      url: "https://berlinmarathon.com"
    },
    {
      id: 4,
      title: "Diamond League Athletics",
      description: "An annual series of elite track and field competitions featuring Olympic and World Champions across various disciplines.",
      tags: ["International", "Track & Field", "Elite"],
      image: "/competitions-placeholder.jpg",
      publisher: "Diamond League Athletics",
      url: "https://diamondleague.com"
    },
    {
      id: 5,
      title: "University Athletics Championships",
      description: "The ultimate collegiate athletics competition showcasing the best university athletes competing across multiple disciplines.",
      tags: ["University", "Multi-discipline", "Championship"],
      image: "/competitions-placeholder.jpg",
      publisher: "University Sports Federation",
      url: "https://universitysports.org"
    },
    {
      id: 6,
      title: "Youth Athletics Festival",
      description: "A celebration of youth athletics featuring competitions, workshops, and training sessions for aspiring young athletes.",
      tags: ["Youth", "Development", "Festival"],
      image: "/competitions-placeholder.jpg",
      publisher: "Youth Athletics Foundation",
      url: "https://youthathletics.org"
    }
  ];

  const openDialog = (competition) => {
    setSelectedCompetition(competition);
  };

  const closeDialog = () => {
    setSelectedCompetition(null);
  };

  return (
    <div className="container mx-auto">
      
      
      <div className="py-20 px-2 flex flex-col space-y-6 items-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Athletics Competitions</h1>
        {competitions.map((competition) => (
          <Card 
            key={competition.id} 
            className="w-full lg:w-5/12 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => openDialog(competition)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={competition.image}
                alt={competition.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{competition.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">{competition.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {competition.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCompetition} onOpenChange={closeDialog}>
        {selectedCompetition && (
          <DialogContent className="sm:max-w-lg">
            <div className="w-full aspect-video mb-4 overflow-hidden rounded-md">
              <img
                src={selectedCompetition.image}
                alt={selectedCompetition.title}
                className="w-full h-full object-cover"
              />
            </div>
            <DialogHeader>
              <DialogTitle>{selectedCompetition.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Published by {selectedCompetition.publisher}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-4">{selectedCompetition.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCompetition.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button asChild>
                <a href={selectedCompetition.url} target="_blank" rel="noopener noreferrer">
                  Explore More
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}