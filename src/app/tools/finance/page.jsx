"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ArrowDown, Wallet, Users, PiggyBank } from "lucide-react"

export default function FinanceDashboard() {
  const expenseData = [
    { name: "Training", value: 45 },
    { name: "Equipment", value: 25 },
    { name: "Rent", value: 20 },
    { name: "Misc", value: 10 },
  ]
 

  const COLORS = [
    'hsl(221.2, 83.2%, 53.3%)',
    'hsl(142.1, 76.2%, 36.3%)',
    'hsl(346.8, 77.2%, 49.8%)',
    'hsl(47.9, 95.8%, 53.1%)', 
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full lg:w-5/12 py-20 px-4">
        {/* Finance Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-center">Finance Dashboard</h1>
          <ArrowDown className="ml-2 h-6 w-6" />
        </div>
        
        {/* Main Container */}
        <div className="border rounded-lg p-6 bg-card text-card-foreground shadow">
          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Taxes Card */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4 pt-6 text-center">
                <PiggyBank className="h-8 w-8 mb-2 text-primary" />
                <p className="font-semibold text-lg">Taxes</p>
                <p className="text-sm text-muted-foreground">Consult a CA</p>
              </CardContent>
            </Card>
            
            {/* Sponsors Card */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4 pt-6 text-center">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <p className="font-semibold text-lg">Sponsors</p>
                <p className="text-sm text-muted-foreground">Agencies Tracker</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Raise Funding Button */}
          <Button 
            className="w-full py-6 text-lg mb-8"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Raise Funding
          </Button>
          
          {/* Expense Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium text-center">Expense Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pie Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value) => `${value}%`} 
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ 
                        paddingTop: "20px",
                        fontSize: "14px",
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}