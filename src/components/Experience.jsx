import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, ContactShadows, Float, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, Scanline } from '@react-three/postprocessing';
import Blob from './Blob';
import Particles from './Particles';
import * as THREE from 'three';

const Scene = ({ scroll, wireframe }) => {
  const cameraRef = useRef();

  useFrame((state) => {
    // Gentle floating camera
    const s = scroll.current;
    if (cameraRef.current) {
      const targetPos = new THREE.Vector3(0, 0, 10);
      const targetLook = new THREE.Vector3(0, 0, 0);

      if (s < 1) { 
        targetPos.set(0, 2 * Math.sin(state.clock.elapsedTime * 0.4), 10);
      } else if (s < 2) { 
        targetPos.set(4, 2, 8);
      } else if (s < 3) { 
        targetPos.set(-4, -2, 9);
      } else if (s < 4) { 
        targetPos.set(0, 5, 7);
      } else { 
        targetPos.set(0, 0, 10);
      }

      cameraRef.current.position.lerp(targetPos, 0.05);
      cameraRef.current.lookAt(targetLook);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={60} />
      
      {/* Sunny Day Bright Lighting: Child-Friendly Clarity */}
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={5} color="#ffd700" />
      <pointLight position={[-10, 10, -10]} intensity={4} color="#42d3ff" />
      <directionalLight position={[0, 10, 5]} intensity={2.5} color="#ffffff" castShadow />

      <Sky sunPosition={[100, 20, 100]} />

      <group>
        <Blob scroll={scroll} wireframe={wireframe} />
        <Particles count={1500} />
      </group>

      <Stars radius={150} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
      
      <Environment preset="city" />

      {/* Gentle, Happy Post-processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
          intensity={0.4} 
          luminanceThreshold={0.8} 
          luminanceSmoothing={1} 
          mipmapBlur 
        />
        <Vignette eskil={false} offset={0.1} darkness={0.4} opacity={0.3} />
        <Noise opacity={0.01} />
      </EffectComposer>
    </>
  );
};

const Experience = ({ scroll, wireframe }) => {
  return (
    <div className="canvas-container fixed inset-0 w-full h-full pointer-events-none">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene scroll={scroll} wireframe={wireframe} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
