import React from 'react';

const QRCodeSection = ({ qrCodeUrl = "/api/placeholder/300/300" }) => (
  // Removed outer div, styling is now handled in App.js
  <>
    <h2 className="text-3xl text-[#4a2683] pb-4 mt-0 mb-5 font-semibold text-center">Doneer nu!</h2>
    {/* Enhanced QR Code Presentation */}
    <div className="w-[300px] h-[300px] mx-auto bg-white p-4 border-2 border-[#f5f5f5] rounded-lg shadow-md">
      <img src={qrCodeUrl} alt="Doneer QR Code" className="w-full h-full object-contain" />
    </div>
    {/* Donation Button Enhancement */}
    <div className="mt-6 text-xl font-medium text-text text-center"> {/* Added text-center */}
      <span className="block mb-2">Scan deze QR code</span>
      <span className="inline-block px-4 py-2 bg-[#f49b28] text-white rounded-full font-bold shadow-md">om te doneren</span>
    </div>
  </>
);

export default QRCodeSection;