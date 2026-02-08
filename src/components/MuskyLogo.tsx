// src/components/MuskyLogo.tsx
type MuskyLogoProps = { size?: number };

export default function MuskyLogo({ size = 64 }: MuskyLogoProps) {
  return (
    <img
      src="/muskyfit-logo.png"
      alt="MuskyFit"
      width={size}
      height={size}
      style={{ display: "block", margin: "0 auto" }}
    />
  );
}
