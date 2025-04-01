import React from 'react';

const Header = () => (
  <header className="bg-[#4a2683] text-white py-6 shadow-md relative overflow-hidden">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      {/* Logo section with more whitespace */}
      <div className="flex items-center space-x-8 mb-4 md:mb-0">
        <img
          src="https://www.kerkemst.nl/wp-content/uploads/2020/06/Logo-Kerk-Emst-Hervormde-Gemeente-Gld.png"
          alt="Kerk Emst Logo"
          className="h-22"
        />
        <img
          src="https://www.woordendaad.nl/app/uploads/2023/02/logo.svg"
          alt="Woord & Daad Logo"
          className="h-25 bg-white p-5"
        />
      </div>

      {/* Event info with improved typography */}
      <div className="text-center md:text-right">
        <h1 className="text-3xl md:text-5xl font-bold mb-1 text-white drop-shadow-md tracking-wide">Actie-avond</h1>
        <p className="text-xl md:text-2xl font-light text-[#f49b28]">5 april 2025</p>
      </div>
    </div>

    {/* Subtle accent line */}
    <div className="absolute -bottom-1 left-0 w-full h-2 bg-[#f49b28]"></div>
  </header>
);

export default Header;