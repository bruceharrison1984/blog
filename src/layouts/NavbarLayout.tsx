import { Navbar } from '@/components/navbar/Navbar';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();

  /** Scroll the content div back to the top on page change
   * This is due to an issue with h-screen retaining the scroll position
   */
  useEffect(() => {
    const element = document.getElementById('content');
    element?.scroll(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar currentPath={pathname} />
      <main
        id="content"
        className="h-screen overflow-x-hidden pt-20 px-5 lg:px-0"
      >
        {children}
      </main>
    </>
  );
};
