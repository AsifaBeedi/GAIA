"use client";

import { useState } from "react";

interface MissionControlProps {
    onScenarioChange: (scenario: string) => void;
}

export default function MissionControl({ onScenarioChange }: MissionControlProps) {
    const [active, setActive] = useState("ai_panic");

    const handleScenario = async (scenario: string) => {
        setActive(scenario);
        try {
            await fetch(`/api/scenario/${scenario}`, { method: 'POST' });
            onScenarioChange(scenario); // Trigger refresh in parent
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="absolute bottom-10 left-10 z-20 bg-black/80 border border-teal-500/30 p-4 rounded-lg backdrop-blur-md w-64">
            <h3 className="text-teal-400 font-mono text-xs tracking-widest mb-4 uppercase border-b border-teal-900 pb-2">
                Scenario Simulation
            </h3>

            <div className="flex flex-col gap-2">
                <button
                    onClick={() => handleScenario("ai_panic")}
                    className={`px-4 py-2 text-xs font-mono text-left transition-all border-l-2 ${active === "ai_panic"
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    ⚠ AI PANIC (CRISIS)
                </button>

                <button
                    onClick={() => handleScenario("mars_colony")}
                    className={`px-4 py-2 text-xs font-mono text-left transition-all border-l-2 ${active === "mars_colony"
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    🚀 MARS COLONY (HOPE)
                </button>
            </div>

            <div className="mt-4 text-[10px] text-gray-600 font-mono">
                STATUS: RUNNING<br />
                NODE: LOCALHOST:8000
            </div>
        </div>
    );
}
