import React from 'react';
import { clsx } from 'clsx';

interface TabPanelProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, isActive, className }) => {
  if (!isActive) return null;
  
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  );
};