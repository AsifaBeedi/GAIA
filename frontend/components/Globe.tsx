"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Stars, Html, Ring } from "@react-three/drei";
import * as THREE from "three";
import { latLongToVector3, getSentimentColor } from "../utils/geo";

interface GlobalEvent {
    id: string;
    topic: string;
    lat: number;
    lng: number;
    sentiment: string;
    lang: string;
    timestamp?: number;
}

interface Props {
    onEventClick: (event: GlobalEvent) => void;
    refreshTrigger: number;
}

const PulsingMarker = ({ event, onClick, isHovered }: { event: GlobalEvent, onClick: (e: any) => void, isHovered: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const position = useMemo(() => latLongToVector3(event.lat, event.lng, 2), [event.lat, event.lng]);
    const color = useMemo(() => getSentimentColor(event.sentiment), [event.sentiment]);

    useFrame((state) => {
        if (ringRef.current) {
            const t = state.clock.getElapsedTime();
            const scale = 1 + (Math.sin(t * 3 + event.lat) * 0.2 + 0.2); // Random phase based on lat
            ringRef.current.scale.set(scale, scale, scale);

            const material = ringRef.current.material as THREE.MeshBasicMaterial;
            if (material) {
                material.opacity = Math.max(0, 1 - (scale - 1) * 2);
            }
        }
    });

    return (
        <group position={position} onClick={onClick}>
            {/* Core Marker */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[isHovered ? 0.08 : 0.04, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Pulsing Ring */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}> {/* Rotate to face out? No, lookAt handled by parent usually or manual */}
                {/* Actually, rings need to face the camera or be flat on surface.
                     Simplest 'pulse' is just a scaling transparent sphere for 3D */}
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} wireframe />
            </mesh>

            <pointLight color={color} distance={1} intensity={2} />

            {isHovered && (
                <Html distanceFactor={10} zIndexRange={[100, 0]}>
                    <div className="bg-black/80 backdrop-blur-md text-white text-xs p-2 rounded border border-teal-500/50 whitespace-nowrap shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                        <div className="font-bold text-teal-300">{event.topic}</div>
                        <div className="opacity-75 capitalize">{event.sentiment}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default function Globe({ onEventClick, refreshTrigger }: Props) {
    const earthRef = useRef<THREE.Mesh>(null);
    const [events, setEvents] = useState<GlobalEvent[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Initial Fetch & Auto-Polling
    useEffect(() => {
        const fetchEvents = () => {
            fetch("/api/events")
                .then((res) => res.json())
                .then((newEvents: GlobalEvent[]) => {
                    setEvents((prev) => {
                        // Merge and keep last 20 unique events
                        const combined = [...prev, ...newEvents];
                        // Remove duplicates by ID just in case
                        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                        // Sort by timestamp if available or just slice tail
                        return unique.slice(-20);
                    });
                })
                .catch((err) => console.error("Failed to fetch events:", err));
        };

        fetchEvents(); // Initial
        const interval = setInterval(fetchEvents, 4000); // Poll every 4s

        return () => clearInterval(interval);
    }, [refreshTrigger]);

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0008;
        }
    });

    return (
        <group>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Sphere ref={earthRef} args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#1e293b"
                    emissive="#000020"
                    emissiveIntensity={0.5}
                    roughness={0.7}
                    metalness={0.5}
                    wireframe={false}
                    transparent={false}
                    opacity={1}
                />

                {events.map((ev) => (
                    <PulsingMarker
                        key={ev.id}
                        event={ev}
                        isHovered={hoveredId === ev.id}
                        onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                    />
                ))}
            </Sphere>

            <pointLight position={[10, 10, 10]} intensity={2.0} color="#2dd4bf" />
            <ambientLight intensity={0.5} />
        </group>
    );
}
