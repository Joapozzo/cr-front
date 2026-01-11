import React from 'react';
import QRCode from 'react-qr-code';
import { cn } from './utils';

interface QRCredencialProps {
    value: string;
    size?: number;
    className?: string;
    fgColor?: string;
    bgColor?: string;
    hideBackground?: boolean;
}

export const QRCredencial: React.FC<QRCredencialProps> = ({
    value,
    size = 180,
    className,
    fgColor = "#000000",
    bgColor = "#ffffff",
    hideBackground = false
}) => {
    return (
        <div className={cn(
            "p-3 rounded-xl shadow-inner border border-gray-100",
            !hideBackground && "bg-white",
            hideBackground && "border-none shadow-none p-0",
            className
        )}>
            <div style={{ height: "auto", margin: "0 auto", maxWidth: size, width: "100%" }}>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={value}
                    viewBox={`0 0 256 256`}
                    level="H" // High error correction
                    bgColor={hideBackground ? "transparent" : bgColor}
                    fgColor={fgColor}
                />
            </div>
        </div>
    );
};
