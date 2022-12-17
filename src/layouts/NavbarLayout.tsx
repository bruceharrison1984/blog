import { Navbar } from '@/components/navbar/Navbar';
import { ReactNode } from 'react';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-screen">
        <main className="mt-24 px-6">{children}</main>
      </main>
    </>
  );
};
