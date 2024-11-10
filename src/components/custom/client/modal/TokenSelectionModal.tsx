import React, { useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IJupiterToken } from "@/lib/interfaces/jupiterToken";
import TokenSelection from '../TokenSelection';

interface TokenSelectionModalProps {
  filteredTokens: IJupiterToken[];
  tokenRefs: React.MutableRefObject<{ [key: string]: React.RefObject<HTMLLIElement> }>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  onClose: () => void;
  onSelectToken: (token: IJupiterToken) => void;
}

const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({
  filteredTokens,
  tokenRefs,
  searchTerm,
  setSearchTerm,
  handleSearch,
  onClose,
  onSelectToken
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="relative flex items-center mb-4">
          <input
            type="text"
            placeholder="Search token"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          />
          <button onClick={handleSearch} className="absolute right-2 p-1 bg-violet-600 text-white rounded">
            <FaSearch />
          </button>
        </div>
        <div className="overflow-y-auto max-h-60 scrollbar-hide">
          <ul className="space-y-2">
            {filteredTokens.map((token, index) => {
              const ref = (tokenRefs.current[token.address] ||= React.createRef());
              return (
                <li key={`${token.address}-${index}`} ref={ref}>
                  <TokenSelection
                    name={token.name}
                    symbol={token.symbol}
                    logoURI={token.logoURI}
                    address={token.address}
                    price={token.price}
                    amount={token.amount}
                    isVerified={token.extensions?.isVerified}
                    freeze_authority={token.freeze_authority}
                    permanent_delegate={token.permanent_delegate}
                    onClick={() => onSelectToken(token)}
                    useProxy={false}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default TokenSelectionModal;
