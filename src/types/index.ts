export type EmissionRecord = {
  id: string;
  date: string;
  category: "electricity" | "fuel" | "waste";
  description: string;
  usage: number;
  emissions: number; // in kg CO2e
};

export type User = {
  name: string;
  email: string;
};

export type EmissionCategory = "electricity" | "fuel" | "waste";
