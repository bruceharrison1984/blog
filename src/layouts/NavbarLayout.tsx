import { ReactNode } from 'react';

export const NavbarLayout = ({ children }: { children: ReactNode }) => (
  <div className="p-6 max-w-sm mx-auto text-center opacity-80">{children}</div>
);
