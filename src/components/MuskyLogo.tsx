export function MuskyLogo({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, margin: "0 auto" }}>
      <img
        src="/logo.png"
        alt="MuskyFit"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
