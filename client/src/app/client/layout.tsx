'use client'
import CodeLoginScreen from "@/components/CodeLoginScreen";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [viewToken, setViewToken] = useState("");

  useEffect(() => {
    setViewToken(sessionStorage.getItem("temp-shipping-view") || "");
  }, []);

  return (
    <html lang="en">
      <body>
        {viewToken ? <CodeLoginScreen/> : children}
      </body>
    </html>
  );
}
