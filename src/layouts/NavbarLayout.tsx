import { Navbar } from '@/components/navbar/Navbar';
import { Navbar2 } from '@/components/navbar2/Navbar2';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();
  return (
    <div className="flex flex-col h-screen">
      {/* <Navbar currentRoute={pathname} /> */}
      <Navbar2 />
      <main className="p-6 justify-center h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
