import { Navbar } from '@/components/navbar/Navbar';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();
  return (
    <div className="flex flex-col h-screen">
      <Navbar currentPath={pathname} />
      <main className="p-6 justify-center h-screen overflow-x-hidden">
        <div className="mt-12">{children}</div>
      </main>
    </div>
  );
};
