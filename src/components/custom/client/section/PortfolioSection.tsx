"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; // ShadCN UI Card

const PortfolioSection = ({
  tokens,
}: {
  tokens: Array<{ name: string; symbol: string; balance: number; change24h: number }>;
}) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold mb-6 text-violet-600 dark:text-violet-400">
      Your Portfolio
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token) => (
        <Card
          key={token.symbol}
          className="hover:scale-105 transition-transform border border-violet-500 bg-white dark:bg-gray-800"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {token.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
              {token.symbol}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800 dark:text-gray-300 mb-1">
              Balance: <strong>{token.balance}</strong> {token.symbol}
            </p>
            <p
              className={`${
                token.change24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              Change (24h): {token.change24h}%
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PortfolioSection;
