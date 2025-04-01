import React from 'react';

const Header = () => (
  <header className="bg-gradient-to-r from-primary to-secondary text-white py-6 shadow-md relative overflow-hidden">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      {/* Logo section */}
      <div className="flex items-center space-x-8 mb-4 md:mb-0">
        <img
          src="https://www.kerkemst.nl/wp-content/uploads/2020/06/Logo-Kerk-Emst-Hervormde-Gemeente-Gld.png"
          alt="Kerk Emst Logo"
          className="h-16 md:h-20 object-contain bg-white rounded-full p-1"
        />
        <img
          src="https://www.woordendaad.nl/app/uploads/2023/02/logo.svg"
          alt="Woord & Daad Logo"
          className="h-12 md:h-16 object-contain"
        />
      </div>

      {/* Event info */}
      <div className="text-center md:text-right">
        <h1 className="text-3xl md:text-5xl font-bold mb-1 text-white drop-shadow-md">Actie-avond</h1>
        <p className="text-xl md:text-2xl font-light">5 april 2024</p>
      </div>
    </div>

    {/* Decorative elements */}
    <div className="absolute -bottom-3 left-0 w-full h-4 bg-secondary opacity-20"></div>
  </header>
);

export default Header;