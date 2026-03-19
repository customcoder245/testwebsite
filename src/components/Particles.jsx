import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Particles = ({ count = 3000 }) => {
    const points = useRef()

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const colorPalette = [
            new THREE.Color("#ff5ebc"),
            new THREE.Color("#42d3ff"),
            new THREE.Color("#ffd700"),
            new THREE.Color("#7bff00"),
            new THREE.Color("#ff7f00")
        ]

        for (let i = 0; i < count; i++) {
            const radius = 15 + Math.random() * 40;
            const theta = THREE.MathUtils.randFloatSpread(360); 
            const phi = THREE.MathUtils.randFloatSpread(360); 

            positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = radius * Math.cos(theta);

            const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        return { positions, colors }
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
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

export default Particles
