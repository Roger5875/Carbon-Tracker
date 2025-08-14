"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb } from "lucide-react";
import { SUSTAINABILITY_TIPS } from "@/lib/constants";

export function SustainabilityTip() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    setTip(
      SUSTAINABILITY_TIPS[
        Math.floor(Math.random() * SUSTAINABILITY_TIPS.length)
      ]
    );
  }, []);

  if (!tip) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="text-amber-400" />
          Sustainability Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{tip}</p>
      </CardContent>
    </Card>
  );
}
