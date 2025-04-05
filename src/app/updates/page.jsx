import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, Briefcase, Calendar, Award } from "lucide-react";

export default function Page() {
  return (
    <div className="container mx-auto p-4 pt-20 pb-20 w-full lg:w-5/12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        <Link href={"/updates/schemes"} className="md:col-span-4">
          <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img
                src="/dummy.png"
                alt="Background"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <div className="grid md:grid-cols-3 relative z-10">
              <div className="md:col-span-1 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <CardDescription>Athletic development</CardDescription>
                  </div>
                  <CardTitle className="text-2xl">Support Schemes</CardTitle>
                </CardHeader>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center p-6">
                <div className="mb-4 space-y-2">
                  <p className="font-medium">
                    Explore government-backed programs designed to support
                    athlete development:
                  </p>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    <li>
                      Elite Athlete Development Program - Funding up to $10,000
                    </li>
                    <li>
                      Sports Excellence Scholarships - Applications open now
                    </li>
                    <li>
                      Youth Athlete Support Initiative - For athletes under 19
                    </li>
                  </ul>
                </div>
                <Button className="w-fit">View Support Programs</Button>
              </div>
            </div>
          </Card>
        </Link>
        <Link
          href={"/updates/competitions"}
          className="md:col-span-2 md:row-span-2"
        >
          <Card className="h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img
                src="/dummy.png"
                alt="Background"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <CardDescription>Upcoming tournaments</CardDescription>
              </div>
              <CardTitle className="text-2xl">Competitions</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow relative z-10">
              <div className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-3">
                  <p className="font-semibold">
                    National Athletics Championship
                  </p>
                  <p className="text-sm text-gray-500">
                    Registration closes in 5 days
                  </p>
                </div>
                <div className="border-l-4 border-amber-300 pl-3">
                  <p className="font-semibold">Regional Qualifier Series</p>
                  <p className="text-sm text-gray-500">New locations added</p>
                </div>
                <div className="border-l-4 border-amber-200 pl-3">
                  <p className="font-semibold">University Sports Festival</p>
                  <p className="text-sm text-gray-500">
                    Early bird discount available
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="w-full">View All Competitions</Button>
            </CardFooter>
          </Card>
        </Link>
        <Link href={"/updates/job-alerts"} className="md:col-span-2">
          <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img
                src="/dummy.png"
                alt="Background"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <CardDescription>Sports careers</CardDescription>
              </div>
              <CardTitle className="text-2xl">Job Alerts</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-2">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Assistant Coach</span>
                  <span className="text-blue-500 font-medium">3 new</span>
                </li>
                <li className="flex justify-between">
                  <span>Sports Therapist</span>
                  <span className="text-blue-500 font-medium">5 new</span>
                </li>
                <li className="flex justify-between">
                  <span>Team Manager</span>
                  <span className="text-blue-500 font-medium">1 new</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="relative z-10 pt-0">
              <Button size="sm" className="w-full">
                View Job Openings
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href={"/updates/events"} className="md:col-span-2">
          <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img
                src="/dummy.png"
                alt="Background"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <CardDescription>Training & networking</CardDescription>
              </div>
              <CardTitle className="text-2xl">Events</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-2">
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Athlete Nutrition Workshop</p>
                  <p className="text-xs text-gray-500">April 15 • Virtual</p>
                </div>
                <div>
                  <p className="font-medium">Pro Athlete Meet & Greet</p>
                  <p className="text-xs text-gray-500">
                    April 22 • National Stadium
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 pt-0">
              <Button size="sm" className="w-full">
                Browse Events
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
