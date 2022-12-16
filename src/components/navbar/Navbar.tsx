import { useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <nav className="navbar fixed shadow-lg bg-neutral text-neutral-content border-base-content border border-opacity-30 py-0 px-1 top-0">
      <div className="flex-1">BLH</div>

      <div className="flex-none">
        <div
          className={`dropdown dropdown-end ${
            isMenuOpen ? 'dropdown-open' : ''
          }`}
        >
          <div className="btn btn-ghost" onClick={toggleMenu}>
            <div id="nav-icon" className="h-12 w-12 p-2 group">
              <svg
                xmlns="<http://www.w3.org/2000/svg>"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-full w-full group-hover:fill-blue-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <ul className="p-2 shadow-md menu dropdown-content bg-base-100 rounded-box w-40 text-base-content border-base-content border border-opacity-20">
            <li
              onClick={() => {
                document.activeElement instanceof HTMLElement &&
                  document.activeElement.blur();
              }}
            >
              <Link href={'/howto'}>How To</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
