/* This example requires Tailwind CSS v3.0+ */
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { Rajdhani } from '@next/font/google';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const raj = Rajdhani({ subsets: ['latin'], weight: '700' });

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Posts', href: '/posts' },
  { name: 'Projects', href: '/projects' },
  { name: 'About Me', href: '/about' },
];

export const Navbar = ({ currentPath }: { currentPath: string }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="absolute w-full p-3 lg:px-8 backdrop-blur-sm border-b-2 border-black border-opacity-50 z-10">
      <nav className="flex items-center justify-between" aria-label="Global">
        <div className="flex lg:flex-1">
          <span className={`${raj.className} text-2xl`}>blh</span>
        </div>
        <div className="flex lg:flex-1 lg:hidden">
          <span>{navigation.find((x) => x.href === currentPath)?.name}</span>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              title={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 text-gray-900  p-1 rounded-lg ${
                currentPath === item.href
                  ? 'bg-purple-500 bg-opacity-50 cursor-default'
                  : 'hover:bg-purple-500 hover:bg-opacity-20'
              }`}
              onClick={(e) => {
                if (currentPath === item.href) {
                  e.preventDefault();
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-2">
          <Link href="https://github.com/bruceharrison1984" target="_blank">
            <Image
              alt={'github_logo'}
              src={'/assets/github_logo.png'}
              height={28}
              width={28}
              quality={100}
              title="View my Github profile"
            />
          </Link>
          <Link
            href="https://www.linkedin.com/in/bruceleeharrison/"
            target="_blank"
          >
            <Image
              alt={'linkedin_logo'}
              src={'/assets/linkedin_logo.png'}
              height={28}
              width={28}
              quality={100}
              title="View my LinkedIn profile"
            />
          </Link>
        </div>
      </nav>
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden h-fit rounded-b-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span className={`${raj.className} text-2xl`}></span>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 ${
                      currentPath === item.href
                        ? 'bg-purple-500 bg-opacity-50 cursor-default'
                        : 'hover:bg-purple-500 hover:bg-opacity-20'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};
