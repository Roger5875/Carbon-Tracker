"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestReductions } from "@/ai/flows/suggest-reductions";
import { useEmissions } from "@/context/EmissionsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
  lifestyle: z.string().min(10, "Please describe your operations briefly."),
});

export function AIInsights() {
  const { emissions } = useEmissions();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      lifestyle: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setRecommendations([]);

    try {
      const electricityUsage = emissions
        .filter((e) => e.category === "electricity")
        .reduce((sum, e) => sum + e.usage, 0);
      const fuelConsumption = emissions
        .filter((e) => e.category === "fuel")
        .reduce((sum, e) => sum + e.usage, 0);
      const wasteGeneration = emissions
        .filter((e) => e.category === "waste")
        .reduce((sum, e) => sum + e.usage, 0);
      
      if (electricityUsage + fuelConsumption + wasteGeneration === 0) {
        toast({
          variant: "destructive",
          title: "No Emission Data",
          description: "Please add some emission records before getting suggestions.",
        });
        setIsLoading(false);
        return;
      }

      const result = await suggestReductions({
        ...values,
        electricityUsage,
        fuelConsumption,
        wasteGeneration,
      });

      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          AI-Powered Reduction Insights
        </CardTitle>
        <CardDescription>
          Get personalized recommendations to reduce your carbon footprint based on your data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Location (City/Country)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lifestyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Operations</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., We are a small software company with 20 employees in a single office. We have a few servers running on-site." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Generating insights...</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Here are some suggestions:</h3>
            <ul className="list-disc space-y-2 pl-5">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
