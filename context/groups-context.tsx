
import React, { createContext, ReactNode, useContext, useState } from 'react';

type Group = {
  id: string;
  name: string;
  duration: string;
  createdAt: number;
  active: boolean;
};

interface GroupsContextType {
  groups: Group[];
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function GroupsProvider({ children }: { children: ReactNode }) {
  // Initialize with your dummy data here
  const [groups, setGroups] = useState<Group[]>([
    { id: "hardcoded-test-1", name: "Isla Nublar", duration: "5 minutes", createdAt: Date.now(), active: true },
    { id: "hardcoded-test-2", name: "Isla Sorna", duration: "30 minutes", createdAt: Date.now(), active: true },
    { id: "hardcoded-test-3", name: "Isla Matanceros", duration: "60 minutes", createdAt: Date.now(), active: true },
    { id: "hardcoded-test-4", name: "Isla Muerta", duration: "1 day", createdAt: Date.now(), active: true },
    { id: "hardcoded-test-5", name: "Isla Pena", duration: "Unlimited", createdAt: Date.now(), active: false },
    { id: "hardcoded-test-6", name: "Isla Tacano", duration: "Unlimited", createdAt: Date.now(), active: false },
    { id: "hardcoded-test-7", name: "Mantah Corp Island", duration: "Unlimited", createdAt: Date.now(), active: false },
  ]);

  const addGroup = (group: Group) => {
    setGroups((prev) => [group, ...prev]);
  };

  const removeGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, removeGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
}