import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const OldRefractiveBall = ({ position, speed, color, size }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
        const time = state.clock.getElapsedTime();
        
        // Chaotic "Old Swarm" Trajectory
        meshRef.current.position.x = position[0] + Math.sin(time * speed * 0.4 + position[0]) * 4;
        meshRef.current.position.y = position[1] + Math.cos(time * speed * 0.4 + position[1]) * 4;
        meshRef.current.position.z = position[2] + Math.sin(time * speed * 0.2 + position[2]) * 3;
        
        meshRef.current.rotation.x += 0.05 * speed;
        meshRef.current.rotation.y += 0.05 * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      {/* 100-Year Experience: Premium Transmission Material for the "Old" feel */}
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={1}
        chromaticAberration={0.15}
        anisotropy={0.2}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.2}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor={color}
        color={color}
      />
    </mesh>
  );
};

const Blob = ({ scroll, wireframe }) => {
  const colors = ["#ff5ebc", "#42d3ff", "#ffd700", "#7bff00", "#ff7f00"];
  const ballCount = 48; // Reverting to the high-energy "Old" count
  
  const balls = useMemo(() => {
    const arr = [];
    for (let i = 0; i < ballCount; i++) {
        arr.push({
            position: [
                (Math.random() - 0.5) * 35,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15
            ],
            speed: 1.2 + Math.random() * 2,
            color: colors[i % colors.length],
            size: 0.3 + Math.random() * 0.6
        });
    }
    return arr;
  }, []);

  return (
    <group>
      {balls.map((ball, i) => (
        <OldRefractiveBall key={i} {...ball} />
      ))}
      
      {/* The Iconic Central Crystal */}
      <Float speed={5} rotationIntensity={3} floatIntensity={3}>
          <mesh castShadow scale={1.8}>
              <octahedronGeometry args={[1, 6]} />
              <meshBasicMaterial 
                  color="#ffffff" 
                  wireframe={wireframe}
                  transparent
                  opacity={0.1}
              />
              <MeshTransmissionMaterial
                backside
                samples={16}
                thickness={2}
                chromaticAberration={0.2}
                anisotropy={0.5}
                distortion={1}
                color="#ff5ebc"
              />
          </mesh>
      </Float>
    </group>
  );
};

export default Blob;
