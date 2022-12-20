import { Navbar } from '@/components/navbar/Navbar';
import { ReactNode } from 'react';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="mt-20 px-6">{children}</main>
    </>
  );
};
