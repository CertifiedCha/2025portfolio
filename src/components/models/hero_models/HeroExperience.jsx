// HeroExperience.jsx (Final Version with GodRays and Rotation)

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useRef } from "react";
// 🌟 Import EffectComposer and GodRays
import { EffectComposer, GodRays } from "@react-three/postprocessing"; 

// Import the Room component
import { Room } from "./Room"; 

// Import HeroLights and the shared layer constant
import HeroLights, { GOD_RAYS_LAYER } from "./HeroLights"; 


// Component to handle model rotation (same as before)
// HeroExperience.jsx (Revised ModelContainer)

// ... existing imports ...

// Component to handle model rotation
function ModelContainer({ children, isMobile }) {
    const modelRef = useRef();
    
    useFrame((state, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y += delta * 0.2; 
        }
    });

    return (
        <group
            ref={modelRef}
            scale={isMobile ? 0.7 : 1}
            position={[0, -3.5, 0]} 
        >
            {children} 
            
            {/* 🛑 Sci-Fi Pedestal/Slab HAS BEEN REMOVED 🛑 */}
            {/* The model is now back to floating! */}
        </group>
    );
}

// ... rest of HeroExperience.jsx and HeroLights.jsx remain the same


const HeroExperience = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
    
    // 🌟 This ref is now crucial again for the GodRays effect
    const sunMeshRef = useRef();

    return (
        <Canvas 
            shadows 
            camera={{ position: [0, 0, 15], fov: 45 }}
            onCreated={({ camera }) => camera.layers.set(0)} 
        >
            
            <OrbitControls
                enablePan={false}
                enableZoom={false} // Keeps webpage scrolling enabled
                maxDistance={20}
                minDistance={5}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2}
            />

            <Suspense fallback={null}>
                {/* Pass the ref and layer down to HeroLights */}
                <HeroLights 
                    godRaysLayer={GOD_RAYS_LAYER} 
                    sunMeshRef={sunMeshRef} 
                />
                
                <ModelContainer isMobile={isMobile}>
                    <Room /> 
                </ModelContainer>
                
            </Suspense>

            {/* 🌟 FINAL STEP: Re-add the Effect Composer and GodRays */}
            <EffectComposer>
                {/* Conditional rendering ensures the effect doesn't crash on initial render */}
                {sunMeshRef.current && (
                    <GodRays 
                        sun={sunMeshRef.current} // The source mesh
                        exposure={0.6} // Controls overall brightness 
                        decay={0.97}   // Controls the length/falloff
                        samples={60}
                        clampMax={1.0}
                        blendFunction={2}
                        cameraLayer={GOD_RAYS_LAYER}
                    />
                )}
            </EffectComposer>

        </Canvas>
    );
};

export default HeroExperience;