import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Particles = ({ count = 2000 }) => {
    const points = useRef()

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const radius = 20 + Math.random() * 30;
            const theta = THREE.MathUtils.randFloatSpread(360); 
            const phi = THREE.MathUtils.randFloatSpread(360); 

            positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = radius * Math.cos(theta);
        }
        return positions
    }, [count])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        points.current.rotation.y = time * 0.05
        points.current.rotation.x = time * 0.03

        const targetX = state.mouse.x * 2;
        const targetY = state.mouse.y * 2;
        points.current.position.x = THREE.MathUtils.lerp(points.current.position.x, targetX, 0.04);
        points.current.position.y = THREE.MathUtils.lerp(points.current.position.y, targetY, 0.04);
    })

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ff5ebc" 
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

export default Particles
