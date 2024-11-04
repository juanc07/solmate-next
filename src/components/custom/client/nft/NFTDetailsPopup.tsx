"use client"; // Indicate this is a client component

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NFTDetailsPopupProps {
  id: string;
  name: string;
  image: string;
  description: string;
  collection: string;
}

const NFTDetailsPopup: React.FC<NFTDetailsPopupProps> = ({ id, name, image, description, collection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="mt-3 w-full text-sm" onClick={() => setIsOpen(true)}>
        View Details
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl w-full p-4 max-h-[80vh] overflow-y-auto">
          {/* Ensure dialog doesn't take up full height */}
          <DialogHeader>
            <DialogTitle className="text-center text-lg md:text-xl">{name}</DialogTitle> {/* Responsive text size */}
          </DialogHeader>
          <div className="mt-2">
            <div className="flex justify-center mb-4">
              <img 
                src={image} 
                alt={name} 
                className="w-full max-w-sm h-auto rounded-md" // Ensure the image scales and has a max width
              />
            </div>
            <p className="text-sm text-gray-500 mb-2">Collection: {collection}</p>
            <div className="mt-2 max-h-32 md:max-h-40 overflow-y-auto scrollbar-hide"> {/* Ensure scrollbar-hide class is applied */}
              <p className="text-sm whitespace-pre-line">{description}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NFTDetailsPopup;
