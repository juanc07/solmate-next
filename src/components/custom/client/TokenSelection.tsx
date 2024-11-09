import { truncateString } from '@/lib/helper';
import { useState, useEffect } from "react";
import Image from "next/image";

interface TokenSelectionProps {
    name: string;
    symbol: string;
    logoURI: string;
    address: string;
    price: number;
    amount: number;
    isVerified?: boolean;
    freeze_authority?: string;
    permanent_delegate?: string;
    onClick: () => void;
}

const defaultImage = "/images/token/default-token.png";

const getProxyUrl = async (imageUrl: string, type: string): Promise<string> => {
    try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&type=${encodeURIComponent(type)}`;
        const response = await fetch(proxyUrl, { method: 'HEAD' });
        const isValidImage = response.ok && response.headers.get("Content-Type")?.startsWith("image/");
        return isValidImage ? proxyUrl : defaultImage;
    } catch (error) {
        return defaultImage;
    }
};

const TokenSelection: React.FC<TokenSelectionProps> = ({
    name,
    symbol,
    logoURI,
    address,
    price,
    amount,
    isVerified,
    freeze_authority,
    permanent_delegate,
    onClick,
}) => {
    const calculatedValue = (amount * price).toFixed(2);
    const [imageSrc, setImageSrc] = useState(defaultImage);

    useEffect(() => {
        const fetchImageSrc = async () => {
            const src = logoURI && logoURI.trim() ? await getProxyUrl(logoURI, "token") : defaultImage;
            setImageSrc(src);
        };
        fetchImageSrc();
    }, [logoURI]);

    return (
        <div
            className="flex items-center space-x-4 p-2 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={onClick}
        >
            <div className="flex-shrink-0 overflow-hidden rounded-full">
                <Image
                    src={imageSrc}
                    alt={name}
                    width={32}
                    height={32}
                    sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                    className="rounded-full object-cover w-[48px] h-[48px]"
                    unoptimized
                />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-black dark:text-white">{name} ({symbol})</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{truncateString(address, 12)}</p>
                {isVerified && <span className="text-green-500 text-xs font-semibold">Verified</span>}
            </div>
            <div className="text-right">
                <p className="text-black dark:text-white">${price.toFixed(2)}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">${calculatedValue}</p>
            </div>
        </div>
    );
};

export default TokenSelection;
