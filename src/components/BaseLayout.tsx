import { ReactNode } from "react";

export default function BaseLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        overflowX: "hidden",
      }}
    >
      {children}
    </div>
  );
}
