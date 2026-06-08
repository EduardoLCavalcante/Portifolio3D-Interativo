export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[-3.5, 4.5, 4.2]} intensity={0.85} color="#f4f6f8" />
      <pointLight position={[2.6, 1.1, 2.8]} intensity={5.5} color="#ff3b30" distance={7} />
      <pointLight position={[-4, -1.4, -2.2]} intensity={2.2} color="#7f8c96" distance={9} />
      <rectAreaLight
        position={[0, 4, -4]}
        rotation={[-0.6, 0, 0]}
        width={7}
        height={2.4}
        intensity={2.1}
        color="#f4f6f8"
      />
      <rectAreaLight
        position={[4, 1.2, 2]}
        rotation={[0, 0.8, 0.1]}
        width={0.8}
        height={5}
        intensity={4.5}
        color="#ff3b30"
      />
    </>
  );
}
