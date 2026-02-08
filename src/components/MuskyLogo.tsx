type MuskyLogoProps = {
  size?: number;
};

export default function MuskyLogo({ size = 64 }: MuskyLogoProps) {
  return (
    <img
      src="/muskyfit-logo.png"
      alt="MuskyFit"
      style={{
        width: size,
        height: size,
        display: "block",
        margin: "0 auto",
      }}
    />
  );
}
