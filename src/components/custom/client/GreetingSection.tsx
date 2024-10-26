const GreetingSection = ({ walletAddress }: { walletAddress: string }) => (
    <div className="p-6 bg-gradient-to-r from-violet-600 to-violet-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold">Welcome back, adventurer!</h2>
      <p className="mt-2">Wallet: <span className="font-mono">{walletAddress}</span></p>
      <p className="mt-2">Total Balance: <span className="font-bold">$5,234.67 USD</span></p>
    </div>
  );
  
  export default GreetingSection;
  