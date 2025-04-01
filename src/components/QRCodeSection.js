import React from 'react';

const QRCodeSection = ({ qrCodeUrl = "/api/placeholder/300/300" }) => (
  <div className="flex-1 flex flex-col mr-12">
    <div className="bg-white rounded-xl p-8 mb-8 shadow-card text-center border-t-4 border-primary">
      <h2 className="text-3xl text-primary pb-4 mt-0 mb-5 font-semibold">Doneer nu!</h2>
      <div className="w-[300px] h-[300px] mx-auto bg-white p-4 border-[8px] border-secondary rounded-lg shadow-soft">
        <img src={qrCodeUrl} alt="Doneer QR Code" className="w-full h-full object-contain" />
      </div>
      <div className="mt-6 text-xl font-medium text-text">
        <span className="block mb-2">Scan deze QR code</span>
        <span className="inline-block px-4 py-2 bg-secondary text-white rounded-full">om te doneren</span>
      </div>
    </div>
  </div>
);

export default QRCodeSection;