"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ArrowDown } from "lucide-react"

export default function FinanceDashboard() {
  // Data for the expense tracker pie chart with consistent naming
  const expenseData = [
    { name: "Training", value: 45 },
    { name: "Equipment", value: 25 },
    { name: "Rent", value: 20 },
    { name: "Misc", value: 10 }, // Changed from "Miscellaneous" to match config key
  ]

  // Color sequence matching chart-1 to chart-4 CSS variables
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ]

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full lg:w-5/12 py-20 px-4">
        {/* Finance Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-center">Finance</h1>
          <ArrowDown className="ml-2 h-6 w-6" />
        </div>

        {/* Main Container with rounded corners */}
        <div className="border rounded-3xl p-6 shadow-sm">
          {/* Top Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Taxes Card */}
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">taxes</p>
                <p className="text-green-600 dark:text-green-400">consult a CA</p>
              </CardContent>
            </Card>

            {/* Sponsors Card */}
            <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-red-600 dark:text-red-400 font-medium">sponsors</p>
                <p className="text-red-600 dark:text-red-400">or agencies</p>
              </CardContent>
            </Card>
          </div>

          {/* Raise Funding Button */}
          <Button variant="outline" className="w-full py-6 text-lg mb-6 border-2">
            Raise Funding
          </Button>

          {/* Expense Tracker */}
          <div className="mt-8">
            <h2 className="text-xl font-medium text-center mb-4">expense tracker</h2>

            {/* Pie Chart */}
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  training: {
                    label: "Training",
                    color: "hsl(var(--chart-1))",
                  },
                  equipment: {
                    label: "Equipment",
                    color: "hsl(var(--chart-2))",
                  },
                  rent: {
                    label: "Rent",
                    color: "hsl(var(--chart-3))",
                  },
                  misc: {
                    label: "Miscellaneous",
                    color: "hsl(var(--chart-4))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData} // Use the corrected expenseData
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}