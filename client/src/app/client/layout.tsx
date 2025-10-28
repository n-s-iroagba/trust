'use client';

import { useEffect, useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewToken, setViewToken] = useState<string | null>(null);


  useEffect(() => {
    // Access sessionStorage only in the browser
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("temp-shipping-view");
      setViewToken(token);
    }
  }, []);

  return (
    <>
  
        {/* 
          If viewToken exists, show PasswordInput.
          Otherwise, show children.
        */}
        {viewToken ? (
          <PasswordInput id={ 0} />
        ) : (
          children
        )}
   
    </>
  );
}
