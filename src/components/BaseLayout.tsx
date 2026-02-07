import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function BaseLayout({ children }: Props) {
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
