const PortfolioSection = ({ tokens }: { tokens: any[] }) => (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold">Your Portfolio</h3>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {tokens.map((token) => (
          <div key={token.name} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h4 className="font-semibold">{token.name}</h4>
            <p>Balance: {token.balance} {token.symbol}</p>
            <p>Change (24h): {token.change24h}%</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default PortfolioSection;
  