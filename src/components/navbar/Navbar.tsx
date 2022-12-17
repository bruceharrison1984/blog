import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="navbar fixed shadow-lg bg-neutral text-neutral-content border-base-content border border-opacity-30 p-0 pl-5 top-0">
      <div className="flex-1">
        <Link href="/">BLH</Link>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost">
            <div id="nav-icon" className="h-12 w-12 p-2 group">
              <svg
                xmlns="<http://www.w3.org/2000/svg>"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-full w-full group-hover:fill-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="p-2 shadow-md menu dropdown-content bg-base-100 rounded-box w-40 text-base-content border-base-content border border-opacity-20"
          >
            <li
              onClick={() =>
                document.activeElement instanceof HTMLElement &&
                document.activeElement.blur()
              }
            >
              <Link href={'/howto'}>How To</Link>
            </li>
            <li></li>
            <li
              onClick={() =>
                document.activeElement instanceof HTMLElement &&
                document.activeElement.blur()
              }
            >
              <Link href={'/aboutme'}>About Me</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
