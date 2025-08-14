"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EMISSION_FACTORS } from "@/lib/constants";
import { useEmissions } from "@/context/EmissionsContext";
import { useToast } from "@/hooks/use-toast";
import type { EmissionCategory } from "@/types";

const formSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  category: z.enum(["electricity", "fuel", "waste"], {
    required_error: "Please select a category.",
  }),
  usage: z.coerce.number().min(0.01, "Usage must be greater than 0."),
  description: z.string().min(3, "Please provide a brief description."),
});

type FormData = z.infer<typeof formSchema>;

export default function CalculatorPage() {
  const [calculatedEmissions, setCalculatedEmissions] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { addEmission } = useEmissions();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const category = form.watch("category");
  const usage = form.watch("usage");

  const units = {
    electricity: "kWh",
    fuel: "liters",
    waste: "kg",
  };

  const calculateEmissions = (data: FormData) => {
    return data.usage * EMISSION_FACTORS[data.category as EmissionCategory];
  };

  const onCalculate = form.handleSubmit((data) => {
    setIsCalculating(true);
    const emissions = calculateEmissions(data);
    setTimeout(() => {
        setCalculatedEmissions(emissions);
        setIsCalculating(false);
    }, 500);
  });

  const onSave = () => {
    const values = form.getValues();
    if (!calculatedEmissions) {
        toast({ title: "No calculation found", description: "Please calculate emissions before saving.", variant: "destructive" });
        return;
    }
    addEmission({
        ...values,
        date: format(values.date, "yyyy-MM-dd"),
        emissions: calculatedEmissions,
    });
    toast({ title: "Success", description: "Emission record saved successfully." });
    form.reset();
    setCalculatedEmissions(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carbon Calculator</h1>
        <p className="text-muted-foreground">
          Calculate and record your company's carbon emissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Emission Record</CardTitle>
          <CardDescription>
            Fill in the details below to calculate emissions for a specific activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onCalculate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Monthly office electricity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Record</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an emission category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="fuel">Fuel</SelectItem>
                          <SelectItem value="waste">Waste</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Usage {category && `(${units[category as keyof typeof units]})`}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={isCalculating}>
                  {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate
                </Button>
                {calculatedEmissions !== null && (
                  <Button variant="secondary" onClick={onSave}>Save Record</Button>
                )}
              </div>
            </form>
          </Form>

          {calculatedEmissions !== null && (
            <Card className="mt-8 bg-secondary">
              <CardHeader>
                <CardTitle>Calculation Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {calculatedEmissions.toFixed(2)}{" "}
                  <span className="text-xl font-medium text-muted-foreground">kg CO₂e</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on a usage of {usage} {units[category as keyof typeof units]} and an emission factor of {EMISSION_FACTORS[category as EmissionCategory]}.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
