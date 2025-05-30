import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface ProgramContextType {
  programName: string;
  setProgramName: (name: string) => void;
}

// Create the context with a default value (used only for type safety)
const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

// Provider component
export const ProgramProvider = ({ children }: { children: ReactNode }) => {
  const [programName, setProgramName] = useState<string>('');

  return (
    <ProgramContext.Provider value={{ programName, setProgramName }}>
      {children}
    </ProgramContext.Provider>
  );
};

import { useContext } from 'react';
import { ProgramContext } from './ProgramContext';

export const useProgram = () => {
  const context = useContext(ProgramContext);

  if (!context) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }

  return context;
};
