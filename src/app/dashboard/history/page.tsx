"use client";

import { useMemo, useState } from "react";
import { useEmissions } from "@/context/EmissionsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { EmissionRecord } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { emissions, deleteEmission, loading } = useEmissions();
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("all");

  const filteredEmissions = useMemo(() => {
    return emissions
      .filter((e) =>
        e.description.toLowerCase().includes(filter.toLowerCase())
      )
      .filter((e) => (category === "all" ? true : e.category === category))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [emissions, filter, category]);
  
  const downloadCSV = () => {
    const headers = ["ID", "Date", "Category", "Description", "Usage", "Emissions (kg CO2e)"];
    const rows = filteredEmissions.map(e => [e.id, e.date, e.category, `"${e.description}"`, e.usage, e.emissions]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emission_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emission History</h1>
        <p className="text-muted-foreground">
          View and manage your past emission records.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Records</CardTitle>
          <CardDescription>
            A complete log of all calculated emissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Filter by description..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="waste">Waste</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={downloadCSV} variant="outline" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Emissions (kg CO₂e)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                        </TableRow>
                    ))
                ) : filteredEmissions.length > 0 ? (
                  filteredEmissions.map((record: EmissionRecord) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "dd MMM, yyyy")}</TableCell>
                      <TableCell className="font-medium">{record.description}</TableCell>
                      <TableCell>
                        <span className="capitalize px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">{record.category}</span>
                      </TableCell>
                      <TableCell className="text-right">{record.emissions.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteEmission(record.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
