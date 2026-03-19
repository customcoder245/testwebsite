import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, ContactShadows, Float, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, Scanline, ChromaticAberration, Glitch } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import Blob from './Blob';
import Particles from './Particles';
import * as THREE from 'three';

const Scene = ({ scroll, wireframe }) => {
  const cameraRef = useRef();

  useFrame((state) => {
    const s = scroll.current;
    if (cameraRef.current) {
      const targetPos = new THREE.Vector3(0, 0, 12);
      const targetLook = new THREE.Vector3(0, 0, 0);

      // 100-Years Parallax Mouse Cam
      const mx = state.mouse.x * 2;
      const my = state.mouse.y * 2;

      if (s < 1) { 
        targetPos.set(mx, 2 + my, 12);
      } else if (s < 2) { 
        targetPos.set(6 + mx, my, 10);
      } else if (s < 3) { 
        targetPos.set(-6 + mx, -2 + my, 11);
      } else if (s < 4) { 
        targetPos.set(mx, 6 + my, 9);
      } else { 
        targetPos.set(mx, my, 12);
      }

      cameraRef.current.position.lerp(targetPos, 0.05);
      cameraRef.current.lookAt(targetLook);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 12]} fov={60} />
      
      {/* High-Contrast "Tabahi" Lighting */}
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={10} color="#ffd700" />
      <pointLight position={[-10, 10, -10]} intensity={8} color="#42d3ff" />
      <directionalLight position={[0, 10, 5]} intensity={4} color="#ffffff" castShadow />

      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} />

      <group>
        <Blob scroll={scroll} wireframe={wireframe} />
        <Particles count={3000} />
      </group>

      <Stars radius={150} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
      
      <Environment preset="night" />

      {/* "Powerful" Old Post-processing Stack */}
      <EffectComposer disableNormalPass>
        <Bloom 
          intensity={0.8} 
          luminanceThreshold={0.5} 
          luminanceSmoothing={0.9} 
          mipmapBlur 
        />
        <ChromaticAberration offset={[0.002, 0.002]} />
        <Glitch 
          delay={[2, 4]} 
          duration={[0.1, 0.3]} 
          strength={[0.1, 0.2]} 
          ratio={0.1}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
        <Noise opacity={0.05} />
        <Scanline opacity={0.05} density={1.2} />
      </EffectComposer>
    </>
  );
};

const Experience = ({ scroll, wireframe }) => {
  return (
    <div className="canvas-container fixed inset-0 w-full h-full pointer-events-none">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 12], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene scroll={scroll} wireframe={wireframe} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
