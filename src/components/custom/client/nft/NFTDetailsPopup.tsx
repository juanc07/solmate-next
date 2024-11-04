import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import a loader icon

interface NFTDetailsPopupProps {
  id: string;
  name: string;
  image: string;
  description?: string;
  collection: string;
}

const NFTDetailsPopup: React.FC<NFTDetailsPopupProps> = ({
  id,
  name,
  image,
  description,
  collection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to track image loading

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <Button className="mt-3 w-full text-sm" onClick={() => setIsOpen(true)}>
        View Details
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl w-full p-4 max-h-[80vh] overflow-y-auto scrollbar-hide"
          aria-describedby={description ? "dialog-description" : undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-lg md:text-xl">
              {name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex justify-center items-center mb-4 relative w-full h-auto">
              {isLoading && (
                <div className="absolute flex justify-center items-center w-full h-full bg-gray-200 rounded-md">
                  <Loader2 className="animate-spin text-violet-600 w-8 h-8" />
                </div>
              )}
              <div className="relative w-full h-0 pb-[100%] md:pb-[80%]"> {/* Adjust aspect ratio here */}
                <Image
                  src={image}
                  alt={name}
                  fill
                  className={`object-contain rounded-md transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  unoptimized
                  onLoad={handleImageLoad} // Use onLoad instead of onLoadingComplete
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">Collection: {collection}</p>
            {description && (
              <DialogDescription id="dialog-description">
                <p className="text-sm whitespace-pre-line">{description}</p>
              </DialogDescription>
            )}
            <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NFTDetailsPopup;
