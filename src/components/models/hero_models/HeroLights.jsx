// HeroLights.jsx (Final Version - All Lights & GodRays Source)

import React, { useRef } from 'react';
import { SpotLight } from "@react-three/drei";

export const GOD_RAYS_LAYER = 1;

const HeroLights = ({ godRaysLayer, sunMeshRef }) => {
    const spotlightRef = useRef();
    const spotlightColor = "#FFFFFF";       
    const platformLightColor = "#33DDFF"; 
    const ambientColor = "#FFFFFF";         
    const ambientIntensity = 0.5;
    
    return (
        <>
            {/* 🌟 1. GOD RAYS SOURCE MESH (Invisible cone generator) */}
            <mesh 
                ref={sunMeshRef} // Pass the ref here
                position={[0, 15, 0]} 
                layers={[godRaysLayer]} // Layer 1: Only visible to GodRays effect
            >
                <sphereGeometry args={[0.5, 16, 16]} />
                {/* CRITICAL: toneMapped=false for maximum cone brightness */}
                <meshBasicMaterial 
                    color={spotlightColor} 
                    toneMapped={false} 
                /> 
            </mesh>

            {/* 2. MAIN SPOTLIGHT (The actual illumination) */}
            <SpotLight
                ref={spotlightRef}
                position={[-10, 15, -3]}          
                target-position={[0, 0, 0]}    
                intensity={100}               
                angle={Math.PI / 12}           
                penumbra={0.7}
                decay={1}
                distance={50}
                color={spotlightColor}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-bias={-0.0001}
            />

            {/* 3. PLATFORM LIGHT FROM BELOW */}
            <pointLight 
                position={[0, -5, 0]}
                intensity={70}
                color={platformLightColor}
            />

            {/* 4. SCENE AMBIENT LIGHT */}
            <ambientLight
                intensity={ambientIntensity}
                color={ambientColor}
            />
            <hemisphereLight
                // Light color from the sky
                skyColor={0xffffff} 
                // Light color from the ground (can be set to a darker color for contrast)
                groundColor={0x000000}
                intensity={5}
            />
        </>
    );
};

export default HeroLights;