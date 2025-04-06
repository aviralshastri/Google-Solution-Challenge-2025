"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RunningTracker() {
  const [currentMonth, setCurrentMonth] = useState("May");
  const [previousMonth, setPreviousMonth] = useState("April");
  const generateCalendarData = () => {
    const days = [];
    for (let i = 1; i <= 35; i++) {
      if (i <= 31) {
        const status = [
          1, 2, 3, 5, 7, 8, 10, 12, 15, 16, 19, 20, 21, 23, 25, 28,
        ].includes(i)
          ? "active"
          : [4, 9, 14, 18, 24].includes(i)
          ? "missed"
          : "inactive";

        days.push({
          day: i,
          status: status,
        });
      } else {
        // Empty cells for grid alignment
        days.push({ day: null, status: "empty" });
      }
    }
    return days;
  };

  const calendarData = generateCalendarData();

  // Enhanced chart data with labeled dates and values
  const chartData = [
    { day: "1", date: "May 1", pace: 7.2, distance: 3.5, time: 25, heart: 145 },
    { day: "3", date: "May 3", pace: 6.8, distance: 4.0, time: 27, heart: 150 },
    { day: "7", date: "May 7", pace: 6.5, distance: 4.5, time: 29, heart: 148 },
    {
      day: "10",
      date: "May 10",
      pace: 6.9,
      distance: 5.0,
      time: 35,
      heart: 155,
    },
    {
      day: "14",
      date: "May 14",
      pace: 6.6,
      distance: 4.8,
      time: 32,
      heart: 152,
    },
    {
      day: "18",
      date: "May 18",
      pace: 6.3,
      distance: 5.2,
      time: 33,
      heart: 150,
    },
    {
      day: "21",
      date: "May 21",
      pace: 6.1,
      distance: 5.5,
      time: 34,
      heart: 153,
    },
    {
      day: "25",
      date: "May 25",
      pace: 5.9,
      distance: 6.0,
      time: 35,
      heart: 149,
    },
    {
      day: "28",
      date: "May 28",
      pace: 5.7,
      distance: 6.2,
      time: 35,
      heart: 147,
    },
    {
      day: "30",
      date: "May 30",
      pace: 5.5,
      distance: 6.5,
      time: 36,
      heart: 146,
    },
  ];

  // State for chart view selection
  const [chartMetric, setChartMetric] = useState("pace");

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded shadow-md">
          <p className="font-bold">{data.date}</p>
          <p className="text-sm text-muted-foreground">
            Pace: {data.pace} min/km
          </p>
          <p className="text-sm text-muted-foreground">
            Distance: {data.distance} km
          </p>
          <p className="text-sm text-muted-foreground">Time: {data.time} min</p>
          <p className="text-sm text-muted-foreground">
            Heart Rate: {data.heart} bpm
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to handle month navigation
  const handleNextMonth = () => {
    setPreviousMonth(currentMonth);
    setCurrentMonth(currentMonth === "April" ? "May" : "June");
  };

  const handlePrevMonth = () => {
    setCurrentMonth(previousMonth);
    setPreviousMonth(previousMonth === "April" ? "March" : "April");
  };

  return (
    <div className="w-full lg:w-5/12 py-20 mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-center">
            Performance
          </CardTitle>
        </CardHeader>

        {/* Performance Metrics Section */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-center font-medium mb-2">Running Time</h3>
                <p className="text-center text-2xl font-bold">42:15</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-center font-medium mb-2">
                  Distance Covered
                </h3>
                <p className="text-center text-2xl font-bold">5.2 km</p>
              </CardContent>
            </Card>
          </div>

          {/* Training Time Section */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-center font-medium mb-2">Training Time</h3>
              <p className="text-center text-2xl font-bold">3:45:30</p>
              <Progress value={65} className="h-2 mt-2" />
            </CardContent>
          </Card>

          {/* Streak Calendar Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium px-1">Streak Calendar</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {previousMonth}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleNextMonth}
                >
                  {currentMonth === "April" ? "May" : "June"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarData.map((item, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center rounded text-sm font-medium ${
                        item.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : item.status === "missed"
                          ? "bg-destructive/20 text-destructive"
                          : item.status === "inactive"
                          ? "bg-muted text-muted-foreground"
                          : "bg-transparent"
                      }`}
                    >
                      {item.status === "missed" ? "X" : item.day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Match Stats Section with Improved Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium px-1">Match Stats</h3>
              <div className="flex gap-2">
                <Button
                  variant={chartMetric === "pace" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setChartMetric("pace")}
                >
                  Pace
                </Button>
                <Button
                  variant={chartMetric === "distance" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setChartMetric("distance")}
                >
                  Distance
                </Button>
                <Button
                  variant={chartMetric === "heart" ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => setChartMetric("heart")}
                >
                  Heart Rate
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 40,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff"
                        opacity={0.3}
                      />

                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 14, fill: "#ffffff" }}
                        tickLine={{ stroke: "hsl(var(--muted))" }}
                        axisLine={{ stroke: "hsl(var(--muted))" }}
                        label={{
                          value: "Day of Month",
                          position: "insideBottom",
                          offset: -5,
                          fontSize: 14,
                          fill: "#ffffff",
                        }}
                      />

                      <YAxis
                        tick={{ fontSize: 14, fill: "#ffffff" }}
                        tickLine={{ stroke: "hsl(var(--muted))" }}
                        axisLine={{ stroke: "hsl(var(--muted))" }}
                        label={{
                          value:
                            chartMetric === "pace"
                              ? "min/km"
                              : chartMetric === "distance"
                              ? "kilometers"
                              : "bpm",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          fontSize: 14,
                          fill: "#ffffff",
                        }}
                        domain={
                          chartMetric === "pace"
                            ? [5, 8]
                            : chartMetric === "distance"
                            ? [0, 8]
                            : [140, 160]
                        }
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Line
                        type="monotone"
                        dataKey={chartMetric}
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={{
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 2,
                          fill: "white",
                          r: 4,
                        }}
                        activeDot={{
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 2,
                          fill: "hsl(var(--primary))",
                          r: 6,
                        }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex items-center justify-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mr-1" />
                  <span>Hover over data points for more details</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
