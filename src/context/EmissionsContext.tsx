"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { EmissionRecord } from "@/types";
import { useAuth } from "./AuthContext";

const MOCK_EMISSIONS_DATA: EmissionRecord[] = [
  { id: "1", date: "2024-06-15", category: "electricity", description: "Office electricity", usage: 1200, emissions: 480 },
  { id: "2", date: "2024-06-20", category: "fuel", description: "Delivery van", usage: 150, emissions: 346.5 },
  { id: "3", date: "2024-06-25", category: "waste", description: "General office waste", usage: 50, emissions: 28.5 },
  { id: "4", date: "2024-07-15", category: "electricity", description: "Office electricity", usage: 1350, emissions: 540 },
  { id: "5", date: "2024-07-20", category: "fuel", description: "Delivery van", usage: 160, emissions: 369.6 },
  { id: "6", date: "2024-07-25", category: "waste", description: "General office waste", usage: 55, emissions: 31.35 },
];


interface EmissionsContextType {
  emissions: EmissionRecord[];
  addEmission: (record: Omit<EmissionRecord, "id">) => void;
  deleteEmission: (id: string) => void;
  loading: boolean;
}

const EmissionsContext = createContext<EmissionsContextType | undefined>(
  undefined
);

export function EmissionsProvider({ children }: { children: ReactNode }) {
  const [emissions, setEmissions] = useState<EmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const storedEmissions = localStorage.getItem('carbon-track-emissions');
      if (storedEmissions) {
        setEmissions(JSON.parse(storedEmissions));
      } else {
        setEmissions(MOCK_EMISSIONS_DATA);
        localStorage.setItem('carbon-track-emissions', JSON.stringify(MOCK_EMISSIONS_DATA));
      }
    } else {
      setEmissions([]);
      localStorage.removeItem('carbon-track-emissions');
    }
    setLoading(false);
  }, [isAuthenticated]);
  
  const addEmission = (record: Omit<EmissionRecord, "id">) => {
    const newRecord = { ...record, id: new Date().toISOString() };
    const updatedEmissions = [...emissions, newRecord];
    setEmissions(updatedEmissions);
    localStorage.setItem('carbon-track-emissions', JSON.stringify(updatedEmissions));
  };

  const deleteEmission = (id: string) => {
    const updatedEmissions = emissions.filter((e) => e.id !== id);
    setEmissions(updatedEmissions);
    localStorage.setItem('carbon-track-emissions', JSON.stringify(updatedEmissions));
  };

  return (
    <EmissionsContext.Provider value={{ emissions, addEmission, deleteEmission, loading }}>
      {children}
    </EmissionsContext.Provider>
  );
}

export function useEmissions() {
  const context = useContext(EmissionsContext);
  if (context === undefined) {
    throw new Error("useEmissions must be used within an EmissionsProvider");
  }
  return context;
}
