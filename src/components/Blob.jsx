import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const BouncyBubble = ({ position, speed, color, size, scroll }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Playful bouncy motion
      meshRef.current.position.y += Math.sin(time * speed) * 0.01;
      meshRef.current.position.x += Math.cos(time * speed * 0.5) * 0.01;
      
      meshRef.current.rotation.y += 0.01 * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.1}
        roughness={0}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const Blob = ({ scroll, wireframe }) => {
  // Vibrant, playful colors for the "child-friendly" bubbles
  const colors = ["#ff5ebc", "#42d3ff", "#ffd700", "#7bff00", "#ff7f00"];
  const bubbleCount = 15;
  
  const bubbles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < bubbleCount; i++) {
        arr.push({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ],
            speed: 1 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 0.5 + Math.random() * 1.5
        });
    }
    return arr;
  }, []);

  return (
    <group>
      {bubbles.map((bubble, i) => (
        <Float key={i} speed={4 * bubble.speed} rotationIntensity={0.5} floatIntensity={2}>
           <BouncyBubble {...bubble} scroll={scroll} />
        </Float>
      ))}
      
      {/* Central "Happy Heart" Node */}
      <Float speed={5} rotationIntensity={1} floatIntensity={1.5}>
          <mesh castShadow receiveShadow scale={2}>
              <octahedronGeometry args={[1, 4]} />
              <meshStandardMaterial 
                  color="#ff5ebc" 
                  emissive="#ff5ebc" 
                  emissiveIntensity={1} 
                  metalness={0} 
                  roughness={0} 
                  wireframe={wireframe}
              />
          </mesh>
      </Float>
    </group>
  );
};

export default Blob;
