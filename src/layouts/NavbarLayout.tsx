import { Navbar } from '@/components/navbar/Navbar';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();
  return (
    <>
      <Navbar currentPath={pathname} />
      <main className="justify-center h-screen overflow-x-hidden pt-20">
        {children}
      </main>
    </>
  );
};
