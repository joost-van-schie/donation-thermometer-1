import React from 'react';

const QRCode = () => {
  return (
    <div className="flex-1 flex flex-col mr-12">
      <div className="bg-white rounded-xl p-8 mb-8 shadow-lg text-center">
        <h2 className="text-3xl text-primary border-b-0 pb-4 mt-0 mb-5">Doneer nu!</h2>
        <div className="w-[300px] h-[300px] mx-auto bg-white p-4 border-[10px] border-primary rounded-lg">
          <img src="/api/placeholder/300/300" alt="Doneer QR Code" className="w-full h-full object-contain" />
        </div>
        <div className="mt-5 text-xl font-bold text-secondary">Scan deze QR code om te doneren</div>
      </div>
    </div>
  );
};

export default QRCode;
