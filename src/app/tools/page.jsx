import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, LigatureIcon as Bandage, DollarSign, TrendingUp } from "lucide-react"

export default function Tools() {
  return (
    <div className="container mx-auto p-4 pt-20 pb-20 w-full lg:w-5/12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        {/* Finance - Full width card with internal grid */}
        <Link href={"/tools/finance"} className="md:col-span-4">
          <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img src="/dummy.png" alt="Background" className="w-full h-full object-cover opacity-10" />
            </div>
            <div className="grid md:grid-cols-3 relative z-10">
              <div className="md:col-span-1 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <CardDescription>Money</CardDescription>
                  </div>
                  <CardTitle className="text-2xl">Finances</CardTitle>
                </CardHeader>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center p-6">
                <div className="mb-4 space-y-2">
                  <p className="font-medium">Manage your financial resources effectively:</p>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    <li>Monthly income: $12,450 (+5% from last month)</li>
                    <li>Monthly expenses: $8,275 (Housing, Training, Equipment)</li>
                    <li>Savings goal: 68% complete ($4,175 this month)</li>
                  </ul>
                </div>
                <Button className="w-fit">View Financial Report</Button>
              </div>
            </div>
          </Card>
        </Link>

        {/* Performance - Tall card spanning 2 rows */}
        <Link href={"/tools/performance"} className="md:col-span-2 md:row-span-2">
          <Card className="h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img src="/dummy.png" alt="Background" className="w-full h-full object-cover opacity-10" />
            </div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <CardDescription>Track progress</CardDescription>
              </div>
              <CardTitle className="text-2xl">Performance</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow relative z-10">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-semibold">Recent PB</p>
                  <p className="text-sm text-gray-500">+12.5% • Achieved last week</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-3">
                  <p className="font-semibold">Training Load</p>
                  <p className="text-sm text-gray-500">Optimal • 85% of target</p>
                </div>
                <div className="border-l-4 border-blue-300 pl-3">
                  <p className="font-semibold">Recovery Status</p>
                  <p className="text-sm text-gray-500">Good • Ready for high intensity</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-xs text-blue-500 font-medium">Weekly Improvement</div>
                  <div className="text-lg font-bold">+8.3%</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="w-full">View Detailed Metrics</Button>
            </CardFooter>
          </Card>
        </Link>

        {/* Injury Management - Half width card */}
        <Link href={"/tools/injury"} className="md:col-span-2">
          <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img src="/dummy.png" alt="Background" className="w-full h-full object-cover opacity-10" />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center gap-2">
                <Bandage className="h-5 w-5 text-red-500" />
                <CardDescription>Wellness</CardDescription>
              </div>
              <CardTitle className="text-2xl">Injury Tracker</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs font-medium">75%</span>
              </div>
              <p className="text-sm mb-2">Recovery on track - 2 weeks remaining</p>
              <p className="text-xs text-muted-foreground">Next assessment: Thursday</p>
            </CardContent>
            <CardFooter className="relative z-10 pt-0">
              <Button size="sm" className="w-full">
                Update Status
              </Button>
            </CardFooter>
          </Card>
        </Link>

        {/* Career Management - Half width card */}
        <Link href={"/tools/career"} className="md:col-span-2">
          <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 z-0">
              <img src="/dummy.png" alt="Background" className="w-full h-full object-cover opacity-10" />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <CardDescription>Development</CardDescription>
              </div>
              <CardTitle className="text-2xl">Career</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-2">
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Skills to Develop</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Leadership</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Media</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Networking</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium mt-2">Next Milestone</p>
                  <p className="text-xs text-gray-500">Professional certification - Due in 3 months</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 pt-0">
              <Button size="sm" className="w-full">
                Update Plan
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}

