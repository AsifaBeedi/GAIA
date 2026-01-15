"use client";

import { useState, useEffect } from "react";

interface BroadcastTerminalProps {
    onBroadcast: () => void; // Callback to trigger refresh
}

export default function BroadcastTerminal({ onBroadcast }: BroadcastTerminalProps) {
    const [text, setText] = useState("");
    const [status, setStatus] = useState<"idle" | "locating" | "transmitting" | "success" | "error">("idle");
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        // Try to get location silently on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                },
                (err) => console.log("Geo permission denied, defaulting to null")
            );
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setStatus("transmitting");

        // Use captured location or random fallback
        const finalLat = location ? location.lat : (Math.random() * 160 - 80);
        const finalLng = location ? location.lng : (Math.random() * 360 - 180);

        try {
            const res = await fetch("/api/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: text,
                    lat: finalLat,
                    lng: finalLng,
                    lang: navigator.language.split('-')[0]
                })
            });

            if (res.ok) {
                setStatus("success");
                setText("");
                onBroadcast(); // Refresh globe immediately
                setTimeout(() => setStatus("idle"), 2000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <div className="absolute bottom-10 right-10 z-20 w-80">
            <div className="bg-black/90 border border-teal-500/30 p-4 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                <h3 className="text-teal-400 font-mono text-xs tracking-widest mb-3 uppercase flex justify-between items-center">
                    <span>📡 Global Uplink</span>
                    {status === "transmitting" && <span className="animate-pulse text-yellow-400">SENDING...</span>}
                    {status === "success" && <span className="text-green-400">SENT</span>}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <textarea
                        className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm p-3 font-mono focus:border-teal-500 focus:outline-none resize-none h-24 placeholder-gray-600 rounded"
                        placeholder="Type message to analyze..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={status === "transmitting"}
                    />

                    <div className="flex justify-between items-center">
                        <div className="text-[10px] text-gray-500 font-mono">
                            LOC: {location ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : "UPLINKING..."}
                        </div>
                        <button
                            type="submit"
                            disabled={status === "transmitting" || !text}
                            className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-all rounded 
                                ${!text ? 'bg-gray-800 text-gray-500' : 'bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-black border border-teal-500/50'}
                            `}
                        >
                            Broadcast
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
