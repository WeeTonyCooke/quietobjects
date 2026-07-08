import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function createRibbonGeometry() {
  const segments = 224
  const widthSegments = 14
  const vertices = []
  const normals = []
  const uvs = []
  const indices = []

  const pointAt = (u) => {
    const angle = u * Math.PI * 2
    const radius = 1.22 + Math.sin(angle * 3 + 0.7) * 0.13 + Math.sin(angle * 5) * 0.045
    return new THREE.Vector3(
      Math.cos(angle) * radius + Math.sin(angle * 2.1) * 0.08,
      Math.sin(angle) * 0.76 + Math.sin(angle * 2 + 0.4) * 0.11,
      Math.sin(angle * 2 - 0.3) * 0.24 + Math.cos(angle * 3.2) * 0.06,
    )
  }

  for (let i = 0; i <= segments; i += 1) {
    const u = i / segments
    const center = pointAt(u)
    const next = pointAt((u + 0.001) % 1)
    const tangent = next.clone().sub(center).normalize()
    const radial = new THREE.Vector3(center.x, center.y, 0).normalize()
    const side = new THREE.Vector3().crossVectors(tangent, radial).normalize()
    const twist = u * Math.PI * 3.6 + Math.sin(u * Math.PI * 5.4) * 0.3
    const ribbonAcross = radial.clone().multiplyScalar(Math.cos(twist)).add(side.clone().multiplyScalar(Math.sin(twist)))
    const surfaceNormal = new THREE.Vector3().crossVectors(tangent, ribbonAcross).normalize()

    for (let j = 0; j <= widthSegments; j += 1) {
      const v = j / widthSegments
      const unevenWidth = 0.58 + Math.sin(u * Math.PI * 4.2 + 0.8) * 0.055
      const offset = (v - 0.5) * unevenWidth
      const edgeCurl = Math.pow(Math.abs(v - 0.5) * 2, 2) * 0.04
      const position = center.clone().add(ribbonAcross.clone().multiplyScalar(offset)).add(surfaceNormal.clone().multiplyScalar(edgeCurl))
      vertices.push(position.x, position.y, position.z)
      normals.push(surfaceNormal.x, surfaceNormal.y, surfaceNormal.z)
      uvs.push(u, v)
    }
  }

  for (let i = 0; i < segments; i += 1) {
    for (let j = 0; j < widthSegments; j += 1) {
      const a = i * (widthSegments + 1) + j
      const b = a + widthSegments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()
  return geometry
}

function Ribbon({ experience, reducedMotion, pointer }) {
  const group = useRef()
  const surface = useRef()
  const ghost = useRef()
  const edge = useRef()
  const lastColour = useRef(-1)
  const geometry = useMemo(createRibbonGeometry, [])
  const color = useMemo(() => new THREE.Color(), [])
  const green = useMemo(() => new THREE.Color('#6f7c71'), [])
  const colors = useMemo(() => {
    const count = geometry.attributes.position.count
    const values = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = green.r
      values[i * 3 + 1] = green.g
      values[i * 3 + 2] = green.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(values, 3))
    return values
  }, [geometry, green])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const elapsed = experience.elapsed
    const reveal = experience.object.emergence
    const colourProgress = experience.object.colour
    const damping = 1 - Math.exp(-delta * 0.9)
    const breath = reducedMotion ? 0 : Math.sin(elapsed * 0.115 - 0.8)

    if (!reducedMotion) {
      group.current.rotation.x = -0.08 + Math.sin(elapsed * 0.083) * 0.016
      group.current.rotation.y = -0.32 + Math.sin(elapsed * 0.052 + 0.5) * 0.038
      group.current.rotation.z = -0.14 + Math.sin(elapsed * 0.067 + 1.8) * 0.011
    }
    const breathingScale = reducedMotion ? 0.985 : 0.985 + breath * 0.006
    group.current.scale.setScalar(breathingScale)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.current.x * 0.055, damping)
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      pointer.current.y * 0.04 + breath * 0.008,
      damping,
    )

    surface.current.opacity = 0.015 + reveal * 0.25
    ghost.current.opacity = 0.1 * reveal * (1 - colourProgress * 0.78)
    edge.current.opacity = 0.018 * reveal

    if (Math.abs(colourProgress - lastColour.current) < 0.0015) return
    lastColour.current = colourProgress

    const uv = geometry.attributes.uv
    const attribute = geometry.attributes.color
    for (let i = 0; i < attribute.count; i += 1) {
      const u = uv.getX(i)
      const v = uv.getY(i)
      const leak = u * 0.28 + Math.sin(u * 29.7 + v * 8.1) * 0.075
      const localMix = THREE.MathUtils.smoothstep(colourProgress - leak, 0.015, 0.62)
      color.setHSL((u * 0.63 + v * 0.045 + 0.08) % 1, 0.28, 0.39)
      color.lerp(green, 1 - localMix)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    attribute.needsUpdate = true
  })

  return (
    <group ref={group} rotation={[-0.08, -0.32, -0.14]}>
      <mesh geometry={geometry} scale={1.012}>
        <meshBasicMaterial ref={ghost} color="#6d786e" transparent opacity={0} wireframe side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={surface}
          vertexColors
          transparent
          opacity={0.02}
          roughness={0.78}
          metalness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.004}>
        <meshBasicMaterial ref={edge} color="#929a91" transparent opacity={0} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Rig({ experience, reducedMotion, pointer }) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 6
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.6]} fov={39} />
      <ambientLight intensity={0.26} color="#9ca39a" />
      <directionalLight position={[3, 4, 5]} intensity={1.05} color="#c4c8c0" />
      <pointLight position={[-3, -2, 2]} intensity={0.55} color="#817b73" distance={8} />
      <group position={isMobile ? [0.2, 0.9, 0] : [0.92, 0.16, 0]} scale={isMobile ? 0.68 : 0.92}>
        <Ribbon experience={experience} reducedMotion={reducedMotion} pointer={pointer} />
      </group>
    </>
  )
}

export function RibbonScene({ experience, reducedMotion, pointer }) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <Rig experience={experience} reducedMotion={reducedMotion} pointer={pointer} />
      </Canvas>
    </div>
  )
}
