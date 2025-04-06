// AthleteDashboard.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Medal, Timer, Trophy, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function AthleteDashboard() {
  return (
    <div className="w-full lg:w-5/12 py-20 mx-auto px-4">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-bold">career</h1>
      </div>
      
      {/* Job Alerts Button */}
      <Link href="/updates/job-alerts" className="block mb-6">
        <Button 
          variant="outline" 
          className="w-full py-6 text-lg"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Job Alerts
        </Button>
      </Link>
      
      {/* Monthly Goal Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Upcoming goal:</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Timer className="h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold">10 days left</p>
          </div>
          <Progress value={67} className="h-2 mb-3" />
          <p className="text-primary font-medium">monthly goal</p>
        </CardContent>
      </Card>
      
      {/* Milestones Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1 text-base">
              <Medal className="h-4 w-4 mr-1" /> 
              gold
            </Badge>
            <Badge variant="outline" className="px-4 py-1 text-base">
              <Trophy className="h-4 w-4 mr-1" /> 
              olympics'22
            </Badge>
          </div>
          <Separator className="mb-4" />
          <h2 className="text-xl font-bold text-center">MILESTONES</h2>
        </CardContent>
      </Card>
      
      {/* Olympics 2026 Card */}
      <Card className="mb-6">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-lg text-primary mb-2">olympics 2026:)</p>
          <p className="text-lg text-primary mb-2">plan for it</p>
          <div className="flex items-center justify-center mb-3">
            <Timer className="h-5 w-5 text-muted-foreground mr-2" />
            <p className="text-lg text-primary">5 months left</p>
          </div>
          <Progress value={30} className="h-2" />
        </CardContent>
      </Card>
      
      {/* Coach Button */}
      <Button 
        variant="secondary" 
        className="w-full py-6 text-lg text-primary"
      >
        <Users className="h-5 w-5 mr-2" />
        consult a coach
      </Button>
    </div>
  );
}