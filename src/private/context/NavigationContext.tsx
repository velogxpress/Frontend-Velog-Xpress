"use client";

import { createContext, useContext, useState } from "react";

type NavDataType = {
  data: any;
  setData: (value: any) => void;
};

const NavigationContext = createContext<NavDataType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);

  return (
    <NavigationContext.Provider value={{ data, setData }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used inside NavigationProvider");
  return context;
}
