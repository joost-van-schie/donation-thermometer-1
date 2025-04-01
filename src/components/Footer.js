import React from 'react';

const Footer = () => (
  <footer className="bg-gradient-to-r from-primary/90 to-primary text-white py-4">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
      <div className="flex items-center space-x-4 mb-3 md:mb-0">
        <img
          src="https://www.kerkemst.nl/wp-content/uploads/2020/06/Logo-Kerk-Emst-Hervormde-Gemeente-Gld.png"
          alt="Kerk Emst Logo"
          className="h-10 bg-white p-1 rounded-full"
        />
        <img
          src="https://www.woordendaad.nl/app/uploads/2023/02/logo.svg"
          alt="Woord & Daad Logo"
          className="h-8"
        />
      </div>
      <p className="text-lg md:text-xl">© {new Date().getFullYear()} Woord & Daad Actie-avond</p>
    </div>
  </footer>
);

export default Footer;