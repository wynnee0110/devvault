// src/global.d.ts

export {}; // This ensures the file is treated as a module

declare global {
  interface Window {
    vaultApi: {
      getEntries: () => Promise<any[]>;
      saveEntry: (entry: any) => Promise<any[]>;
      updateEntry: (id: number, updates: any) => Promise<any[]>;
      deleteEntry: (id: number) => Promise<any[]>;
    };
  }
}