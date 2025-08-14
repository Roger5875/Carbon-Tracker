"use client";

import { useEmissions } from "@/context/EmissionsContext";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { formatNumber } from "@/lib/utils";
import { Zap, Fuel, Trash2, Globe, Skeleton } from "lucide-react";
import { SustainabilityTip } from "@/components/dashboard/SustainabilityTip";

export default function DashboardPage() {
  const { emissions, loading } = useEmissions();

  const stats = useMemo(() => {
    const totalEmissions = emissions.reduce((sum, e) => sum + e.emissions, 0);
    const totalElectricity = emissions
      .filter((e) => e.category === "electricity")
      .reduce((sum, e) => sum + e.emissions, 0);
    const totalFuel = emissions
      .filter((e) => e.category === "fuel")
      .reduce((sum, e) => sum + e.emissions, 0);
    const totalWaste = emissions
      .filter((e) => e.category === "waste")
      .reduce((sum, e) => sum + e.emissions, 0);
    return { totalEmissions, totalElectricity, totalFuel, totalWaste };
  }, [emissions]);
  
  const StatCard = ({ title, value, icon, unit, isLoading }: { title: string, value: number, icon: React.ReactNode, unit: string, isLoading: boolean }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-2xl font-bold">
            {formatNumber(value)} <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Your carbon emission dashboard for this period.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Emissions" value={stats.totalEmissions} unit="kg CO₂e" isLoading={loading} icon={<Globe className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Electricity" value={stats.totalElectricity} unit="kg CO₂e" isLoading={loading} icon={<Zap className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Fuel" value={stats.totalFuel} unit="kg CO₂e" isLoading={loading} icon={<Fuel className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Waste" value={stats.totalWaste} unit="kg CO₂e" isLoading={loading} icon={<Trash2 className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <OverviewCharts />

      <div className="grid gap-4 md:grid-cols-2">
        <AIInsights />
        <SustainabilityTip />
      </div>
    </div>
  );
}
