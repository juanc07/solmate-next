"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WalletActivity {
  wallet: string;
  activities: {
    timestamp: string | null;
    token: string; // Token name
    symbol: string; // Token symbol
    mint: string; // Mint address
    amount: number; // Amount of tokens purchased
    type: "buy" | "sell"; // Activity type
  }[];
}

const WalletActivityDashboard: React.FC = () => {
  const [wallets, setWallets] = useState<string[]>([]);
  const [data, setData] = useState<WalletActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/wallet-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallets }),
      });
      const result = await response.json();
      if (response.ok) setData(result);
      else console.error(result.error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Generate unique labels (token names with symbols)
  const barChartLabels = Array.from(
    new Set(data.flatMap((d) => d.activities.map((a) => `${a.token} (${a.symbol})`)))
  );

  // Aggregate buying and selling data for each token
  const buyData = barChartLabels.map((label) =>
    data.reduce(
      (sum, wallet) =>
        sum +
        wallet.activities
          .filter((a) => `${a.token} (${a.symbol})` === label && a.type === "buy")
          .reduce((total, a) => total + a.amount, 0),
      0
    )
  );

  const sellData = barChartLabels.map((label) =>
    data.reduce(
      (sum, wallet) =>
        sum +
        wallet.activities
          .filter((a) => `${a.token} (${a.symbol})` === label && a.type === "sell")
          .reduce((total, a) => total + a.amount, 0),
      0
    )
  );

  // Bar chart data
  const barChartData = {
    labels: barChartLabels,
    datasets: [
      {
        label: "Buying Activity",
        data: buyData,
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Light green
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Selling Activity",
        data: sellData,
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Light red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Wallet Activity Trends</h1>
      <Card className="mb-4 p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            type="text"
            placeholder="Enter wallet addresses (comma-separated)"
            onChange={(e) => setWallets(e.target.value.split(",").map((w) => w.trim()))}
            className="flex-1"
          />
          <Button onClick={fetchActivities} disabled={loading}>
            {loading ? "Loading..." : "Fetch Activities"}
          </Button>
        </div>
      </Card>

      {data.length > 0 && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Token Buying and Selling Trends</h2>
          <div className="w-full h-[400px]">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Wallet Token Trends (Buying vs Selling)" },
                },
              }}
            />
          </div>
        </Card>
      )}

      {data.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Detailed Activity Table</h2>
          <Card className="overflow-x-auto p-4">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Wallet</th>
                  <th className="border-b p-2">Token</th>
                  <th className="border-b p-2">Type</th>
                  <th className="border-b p-2">Amount</th>
                  <th className="border-b p-2">Date</th>
                  <th className="border-b p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) =>
                  d.activities.map((a, idx) => (
                    <tr key={`${d.wallet}-${idx}`}>
                      <td className="p-2 border-b">{d.wallet}</td>
                      <td className="p-2 border-b">{`${a.token} (${a.symbol})`}</td>
                      <td className="p-2 border-b">{a.type}</td>
                      <td className="p-2 border-b">{a.amount}</td>
                      <td className="p-2 border-b">
                        {a.timestamp ? new Date(a.timestamp).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-2 border-b">
                        {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WalletActivityDashboard;
