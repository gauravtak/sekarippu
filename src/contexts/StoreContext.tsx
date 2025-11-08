import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Store } from "@tauri-apps/plugin-store";

interface StoreContextType {
  store: Store | null;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStore() {
      try {
        const loadedStore = await Store.load(".settings.json");
        setStore(loadedStore);
      } catch (error) {
        console.error("Failed to load store:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStore();
  }, []);

  return <StoreContext.Provider value={{ store, isLoading }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
