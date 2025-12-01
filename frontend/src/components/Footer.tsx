import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8 w-full">
      <div className="mw-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* left side - socail media link */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  social-1
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  social-2
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
