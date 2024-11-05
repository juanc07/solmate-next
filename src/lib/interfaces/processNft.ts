export interface IProcessedNFT {
    id: string;
    name: string;
    image: string;
    description: string;
    collection: string;
    isVerified: boolean;
    isScam: boolean;
    solPrice?: number;
}