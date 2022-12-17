import { Navbar } from '@/components/navbar/Navbar';
import { ReactNode } from 'react';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="mt-24 px-6 prose-sm md:prose mx-auto">{children}</main>
    </>
  );
};
