"use client";

import { useEmissions } from "@/context/EmissionsContext";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = {
  electricity: "hsl(var(--chart-1))",
  fuel: "hsl(var(--chart-2))",
  waste: "hsl(var(--chart-3))",
};

export function OverviewCharts() {
  const { emissions, loading } = useEmissions();

  const emissionsByCategory = useMemo(() => {
    return emissions.reduce((acc, record) => {
      if (!acc[record.category]) {
        acc[record.category] = 0;
      }
      acc[record.category] += record.emissions;
      return acc;
    }, {} as Record<string, number>);
  }, [emissions]);

  const pieChartData = useMemo(() => {
    return Object.entries(emissionsByCategory).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [emissionsByCategory]);

  const monthlyEmissions = useMemo(() => {
    const months: { [key: string]: number } = {};
    emissions.forEach(record => {
      const month = new Date(record.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!months[month]) {
        months[month] = 0;
      }
      months[month] += record.emissions;
    });

    return Object.entries(months).map(([name, total]) => ({ name, total })).slice(-12);
  }, [emissions]);

  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Emission Trends</CardTitle>
          <CardDescription>Your total CO₂e emissions over the last year.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEmissions}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatNumber(value as number)} kg`} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Emissions by Category</CardTitle>
          <CardDescription>A breakdown of your total emissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
