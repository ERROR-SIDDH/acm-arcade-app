import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
interface QRCodeDisplayProps {
  url: string;
  size?: number;
  className?: string;
}
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, size = 256, className }) => {
  return (
    <div className={`p-4 bg-white rounded-2xl shadow-lg inline-block ${className}`}>
      <QRCodeSVG
        value={url}
        size={size}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
      />
    </div>
  );
};
export default QRCodeDisplay;