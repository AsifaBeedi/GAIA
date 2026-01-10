import * as THREE from 'three';

// Radius of the globe in the 3D scene (must match the Sphere args in Globe.tsx)
const GLOBE_RADIUS = 2;

export function latLongToVector3(lat: number, lng: number, radius: number = GLOBE_RADIUS): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

// Helper to determine color based on sentiment
export function getSentimentColor(sentiment: string): string {
    switch (sentiment.toLowerCase()) {
        case 'fear': return '#ef4444'; // Red-500
        case 'anger': return '#f97316'; // Orange-500
        case 'joy': return '#22c55e'; // Green-500
        case 'anticipation': return '#3b82f6'; // Blue-500
        case 'sadness': return '#6366f1'; // Indigo-500
        default: return '#cbd5e1'; // Slate-300
    }
}
