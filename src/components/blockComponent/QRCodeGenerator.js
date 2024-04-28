import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeGenerator({value}) {
  return (
    <div style={{
        padding: '20px'
    }}>
      {value && <QRCode value={value} size={250} />}
    </div>
  );
}

export default QRCodeGenerator;
