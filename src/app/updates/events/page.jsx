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
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Dummy events data
  const events = [
    {
      id: 1,
      title: "Athletics Summer Festival",
      description:
        "A three-day celebration of athletics with competitions, exhibitions, and community activities for all ages and skill levels.",
      tags: ["Festival", "Community", "All Ages"],
      image: "/events-placeholder.jpg",
      date: "June 15-17, 2025",
      location: "Central City Stadium",
      time: "9:00 AM - 6:00 PM",
      organizer: "City Athletics Association",
      url: "https://cityathletics.org/festival",
    },
    {
      id: 2,
      title: "Youth Track & Field Day",
      description:
        "An exciting day for young athletes to showcase their talents and compete in various track and field events in a supportive environment.",
      tags: ["Youth", "Track & Field", "Competition"],
      image: "/events-placeholder.jpg",
      date: "May 8, 2025",
      location: "Riverside Sports Complex",
      time: "10:00 AM - 3:00 PM",
      organizer: "Youth Athletics Development",
      url: "https://youthathleticsdevelopment.org",
    },
    {
      id: 3,
      title: "Elite Sprinters Showdown",
      description:
        "Watch the fastest sprinters in the country compete in 100m, 200m, and 400m races in this thrilling one-day event.",
      tags: ["Elite", "Sprints", "Professional"],
      image: "/events-placeholder.jpg",
      date: "July 22, 2025",
      location: "National Athletics Arena",
      time: "6:00 PM - 9:00 PM",
      organizer: "National Athletics Federation",
      url: "https://nationalathletics.org/sprinters",
    },
    {
      id: 4,
      title: "Marathon Training Workshop",
      description:
        "Learn from elite marathon coaches and athletes about training techniques, nutrition, and race strategies to prepare for your next marathon.",
      tags: ["Workshop", "Marathon", "Training"],
      image: "/events-placeholder.jpg",
      date: "April 25, 2025",
      location: "Downtown Conference Center",
      time: "8:30 AM - 2:30 PM",
      organizer: "Marathon Experts Association",
      url: "https://marathonexperts.org",
    },
    {
      id: 5,
      title: "Athletics Awards Gala",
      description:
        "Annual celebration honoring the outstanding achievements of athletes, coaches, and contributors to the sport over the past year.",
      tags: ["Awards", "Formal", "Recognition"],
      image: "/events-placeholder.jpg",
      date: "December 10, 2025",
      location: "Grand Ballroom, Plaza Hotel",
      time: "7:00 PM - 11:00 PM",
      organizer: "Athletics Excellence Foundation",
      url: "https://athleticsexcellence.org/gala",
    },
    {
      id: 6,
      title: "Community Fun Run",
      description:
        "A family-friendly 5k run/walk event promoting fitness and community spirit with prizes, refreshments, and entertainment.",
      tags: ["5K", "Community", "Family"],
      image: "/events-placeholder.jpg",
      date: "August 30, 2025",
      location: "Lakeside Park",
      time: "9:00 AM Start",
      organizer: "Community Health Initiative",
      url: "https://communityhealthrun.org",
    },
  ];

  const openDialog = (event) => {
    setSelectedEvent(event);
  };

  const closeDialog = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto">
      <div className="py-20 px-2 flex flex-col space-y-6 items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">Athletics Events</h1>
        {events.map((event) => (
          <Card
            key={event.id}
            className="w-full lg:w-5/12 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => openDialog(event)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{event.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">
                {event.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={closeDialog}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-lg">
            <div className="w-full aspect-video mb-4 overflow-hidden rounded-md">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Organized by {selectedEvent.organizer}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="mb-4">{selectedEvent.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.time}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedEvent.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button asChild>
                <a
                  href={selectedEvent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
