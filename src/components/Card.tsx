import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#141416",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}
