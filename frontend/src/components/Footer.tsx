import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8 w-full shrink-0">
      <div className="mw-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* left side - socail media link */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/" target="_blank">
                  <button
                    type="button"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                    className="mb-2 inline-block rounded bg-[#0077b5] px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                  >
                    <span className="[&>svg]:h-4 [&>svg]:w-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 448 512"
                      >
                        <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                      </svg>
                    </span>
                  </button>
                </a>

                <a href="https://www.x.com/" target="_blank">
                  <button
                    type="button"
                    data-twe-ripple-init
                    data-twe-ripple-color="light"
                    className="mb-2 inline-block rounded bg-black px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                  >
                    <span className="[&>svg]:h-4 [&>svg]:w-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 512 512"
                      >
                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                      </svg>
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Center - Copyright */}
          <div className="mb-6 md:mb-0 md:w-1/3 flex flex-col items-center">
            <div className="text-center">
              <span>&copy; 2025 Collabrium. All rights reserved.</span>
            </div>
          </div>

          {/* Right side - Nav Links */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Quick Links
              </h3>
              <nav className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-6 items-center md:items-end">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white hover:underline hover:underline-offset-4 hover:decoration-blue-400"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white hover:underline hover:underline-offset-4 hover:decoration-blue-400"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white hover:underline hover:underline-offset-4 hover:decoration-blue-400"
                >
                  Contact Us
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
