"use client";
import { useEffect, useState } from "react";
import Hero from "@components/Hero";
import FeatureGrid from "@components/FeatureGrid";
import ChartSection from "@components/ChartSection";
import StatsSection from "@components/StatsSection";
import AboutUs from "@components/AboutUs";
import ActionButtons from "@components/Buttons";

export default function HomePage() {
  const [userData, setUserData] = useState([]);
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/eduai/stats")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch((err) => console.error("Failed to fetch stats", err));

    fetch("http://localhost:5000/eduai/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error("Failed to fetch user data", err));
  }, []);

  return (
    <div className="p-6 bg-background text-foreground transition-all">
      <Hero />
      <FeatureGrid />
      <ChartSection />
      <StatsSection statsData={statsData} />
      <AboutUs />
      <ActionButtons />
    </div>
  );
}
