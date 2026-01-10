"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Globe from "../components/Globe";
import MissionControl from "../components/MissionControl";
import EventDetails from "../components/EventDetails";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleScenarioChange = (scenario: string) => {
    // Force the Globe to refetch data
    setRefreshTrigger(prev => prev + 1);
    setSelectedEvent(null);
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Mission Control Overlay */}
      <div className="absolute top-0 left-0 p-6 z-10 text-white font-mono pointer-events-none">
        <h1 className="text-4xl font-bold tracking-[0.2em] text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
          GAIA
        </h1>
        <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">
          Planetary Nervous System // <span className="text-green-500 animate-pulse">ONLINE</span>
        </p>
      </div>

      {/* UI Managers */}
      <MissionControl onScenarioChange={handleScenarioChange} />
      <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <Globe
          onEventClick={setSelectedEvent}
          refreshTrigger={refreshTrigger}
        />
        <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  );
}
