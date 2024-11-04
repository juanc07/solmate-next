import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
            <div className="flex justify-center mb-4">
              <img
                src={image}
                alt={name}
                className="w-full max-w-sm h-auto rounded-md"
              />
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
