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
import {
  BuildingIcon,
  MapPinIcon,
  BanknoteIcon,
  CalendarIcon,
} from "lucide-react";

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  const jobs = [
    {
      id: 1,
      title: "Athletics Head Coach",
      description:
        "Lead the development and implementation of high-performance training programs for elite track and field athletes in a national training center.",
      tags: ["Full-Time", "Coaching", "Elite"],
      image: "/job-alert-placeholder.png",
      company: "National Athletics Federation",
      location: "Capital City",
      salary: "$75,000 - $95,000 per annum",
      deadline: "May 15, 2025",
      requirements:
        "Minimum Level 3 coaching certification, 5+ years experience coaching elite athletes, proven track record of athlete development",
      url: "https://nationalathletics.org/careers/head-coach",
    },
    {
      id: 2,
      title: "Athletics Event Manager",
      description:
        "Plan, organize, and execute regional and national athletics competitions, ensuring smooth operations, compliance with regulations, and positive participant experience.",
      tags: ["Full-Time", "Event Management", "Operations"],
      image: "/job-alert-placeholder.png",
      company: "Regional Athletics Association",
      location: "Metropolis",
      salary: "$55,000 - $70,000 per annum",
      deadline: "April 30, 2025",
      requirements:
        "Degree in Event Management or related field, 3+ years experience in sports event management, excellent organizational skills",
      url: "https://regionalathletics.org/jobs/event-manager",
    },
    {
      id: 3,
      title: "Performance Analyst - Track & Field",
      description:
        "Collect, analyze, and interpret performance data to provide actionable insights for coaches and athletes to enhance competitive performance in track and field events.",
      tags: ["Contract", "Analytics", "Performance"],
      image: "/job-alert-placeholder.png",
      company: "Sports Performance Institute",
      location: "Tech Valley",
      salary: "$60,000 - $75,000 per annum",
      deadline: "May 5, 2025",
      requirements:
        "Degree in Sports Science or related field, proficiency in performance analysis software, understanding of track and field biomechanics",
      url: "https://sportsperformance.org/careers/analyst",
    },
    {
      id: 4,
      title: "Youth Athletics Development Officer",
      description:
        "Design and deliver youth athletics programs to identify and nurture young talent while promoting participation and enjoyment of athletics among children and teenagers.",
      tags: ["Part-Time", "Youth Development", "Coaching"],
      image: "/job-alert-placeholder.png",
      company: "Community Sports Trust",
      location: "Riverside County",
      salary: "$30,000 - $40,000 per annum (pro-rated)",
      deadline: "May 20, 2025",
      requirements:
        "Experience working with young people, coaching qualification, DBS/background check, passion for athletics development",
      url: "https://communitysports.org/jobs/youth-officer",
    },
    {
      id: 5,
      title: "Athletics Facility Manager",
      description:
        "Oversee the day-to-day operations, maintenance, and scheduling of a state-of-the-art athletics facility including indoor track, outdoor stadium, and training areas.",
      tags: ["Full-Time", "Facility Management", "Operations"],
      image: "/job-alert-placeholder.png",
      company: "City Sports Complex",
      location: "Downtown Sportsville",
      salary: "$50,000 - $65,000 per annum",
      deadline: "June 1, 2025",
      requirements:
        "Experience in facility management, knowledge of health and safety regulations, excellent organizational and customer service skills",
      url: "https://citysports.org/careers/facility-manager",
    },
    {
      id: 6,
      title: "Athletics Physiotherapist",
      description:
        "Provide assessment, treatment, and rehabilitation services to track and field athletes to optimize performance, prevent injuries, and support recovery from training and competition.",
      tags: ["Full-Time", "Medical", "Support"],
      image: "/job-alert-placeholder.png",
      company: "Elite Sports Medicine Center",
      location: "Athlete's Village",
      salary: "$65,000 - $80,000 per annum",
      deadline: "May 25, 2025",
      requirements:
        "Qualification in Physiotherapy, sports therapy experience, knowledge of athletics-specific injuries and treatments",
      url: "https://sportsmedicine.org/jobs/physiotherapist",
    },
  ];

  const openDialog = (job) => {
    setSelectedJob(job);
  };

  const closeDialog = () => {
    setSelectedJob(null);
  };

  return (
    <div className="container mx-auto">
      <div className="py-20 px-2 flex flex-col space-y-6 items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">Athletics Jobs</h1>
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="w-full lg:w-5/12 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => openDialog(job)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{job.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
                <BuildingIcon className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">
                {job.description}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedJob} onOpenChange={closeDialog}>
        {selectedJob && (
          <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
            <div className="overflow-y-auto px-1">
              <div className="w-full aspect-video mb-4 overflow-hidden rounded-md">
                <img
                  src={selectedJob.image}
                  alt={selectedJob.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {selectedJob.company}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">{selectedJob.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>
                      <strong>Location:</strong> {selectedJob.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>
                      <strong>Salary:</strong> {selectedJob.salary}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>
                      <strong>Application Deadline:</strong>{" "}
                      {selectedJob.deadline}
                    </span>
                  </div>
                  <div className="mt-2">
                    <strong>Requirements:</strong>
                    <p className="mt-1">{selectedJob.requirements}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedJob.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button asChild>
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </a>
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
