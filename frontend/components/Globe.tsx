"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { latLongToVector3, getSentimentColor } from "../utils/geo";

interface GlobalEvent {
    id: number;
    topic: string;
    lat: number;
    lng: number;
    sentiment: string;
    lang: string;
}

interface Props {
    onEventClick: (event: GlobalEvent) => void;
    refreshTrigger: number; // Simple way to force re-fetch
}

export default function Globe({ onEventClick, refreshTrigger }: Props) {
    const earthRef = useRef<THREE.Mesh>(null);
    const [events, setEvents] = useState<GlobalEvent[]>([]);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // Fetch data
    useEffect(() => {
        fetch("/api/events")
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch((err) => console.error("Failed to fetch events:", err));
    }, [refreshTrigger]);

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0005; // Slower, more cinematic rotation
        }
    });

    return (
        <group>
            {/* Starfield Background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* The Earth */}
            <Sphere ref={earthRef} args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#0f172a" // Darker slate
                    emissive="#000"
                    roughness={0.7}
                    metalness={0.5}
                    wireframe={true}
                    transparent
                    opacity={0.8}
                />

                {/* Render Event Markers as children of the Earth so they rotate with it */}
                {events.map((ev) => {
                    const position = latLongToVector3(ev.lat, ev.lng, 2); // 2 is radius
                    const color = getSentimentColor(ev.sentiment);
                    const isHovered = hoveredId === ev.id;

                    return (
                        <mesh
                            key={ev.id}
                            position={position}
                            onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                            onPointerOver={() => setHoveredId(ev.id)}
                            onPointerOut={() => setHoveredId(null)}
                        >
                            <sphereGeometry args={[isHovered ? 0.08 : 0.05, 16, 16]} />
                            <meshBasicMaterial color={color} toneMapped={false} />
                            <pointLight color={color} distance={0.5} intensity={2} />
                            {isHovered && (
                                <Html distanceFactor={10}>
                                    <div className="bg-black/80 text-white text-[8px] p-1 rounded border border-gray-700 whitespace-nowrap">
                                        {ev.topic}
                                    </div>
                                </Html>
                            )}
                        </mesh>
                    );
                })}
            </Sphere>

            {/* Atmosphere Glow */}
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#2dd4bf" />
            <ambientLight intensity={0.5} />
        </group>
    );
}
