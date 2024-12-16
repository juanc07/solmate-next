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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

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
  const [showDialog, setShowDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchPerformed, setFetchPerformed] = useState(false); // Tracks if fetch was performed
  const rowsPerPage = 10;

  const fetchActivities = async () => {
    if (wallets.length === 0 || wallets.every((w) => w.trim() === "")) {
      setShowDialog(true); // Show dialog if no wallet addresses are entered
      return;
    }

    setLoading(true);
    setData([]); // Clear data before fetching new activities
    setCurrentPage(1); // Reset to the first page
    setFetchPerformed(false); // Reset fetch performed state
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
      setFetchPerformed(true); // Mark fetch as performed
      setLoading(false);
    }
  };

  const currentTableData = data.flatMap((wallet) =>
    wallet.activities
      .filter(
        (activity) =>
          activity.mint !== "So11111111111111111111111111111111111111112" &&
          activity.amount > 0
      )
      .map((activity) => ({ ...activity, wallet: wallet.wallet })) // Retain wallet address
  );

  const paginatedData = currentTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(currentTableData.length / rowsPerPage);

  const barChartLabels = Array.from(
    new Set(
      currentTableData.map((a) => `${a.token} (${a.symbol})`)
    )
  );

  const buyData = barChartLabels.map((label) =>
    currentTableData
      .filter(
        (a) =>
          `${a.token} (${a.symbol})` === label &&
          a.type === "buy" &&
          a.amount > 0
      )
      .reduce((sum, a) => sum + a.amount, 0)
  );

  const sellData = barChartLabels.map((label) =>
    currentTableData
      .filter(
        (a) =>
          `${a.token} (${a.symbol})` === label &&
          a.type === "sell" &&
          a.amount > 0
      )
      .reduce((sum, a) => sum + a.amount, 0)
  );

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
    <div className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-white/50 z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-violet-600 w-16 h-16" />
            <p className="mt-4 text-lg text-white dark:text-black">Loading data...</p>
          </div>
        </div>
      )}

      <div className="max-w-[95%] mx-auto px-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Wallet Activity Trends</h1>

        <Card className="mb-6 p-6">
          <div className="flex w-full items-center gap-4">
            <Input
              type="text"
              placeholder="Enter wallet addresses (comma-separated)"
              onChange={(e) => setWallets(e.target.value.split(",").map((w) => w.trim()))}
              className="flex-grow"
            />
            <Button onClick={fetchActivities} disabled={loading}>
              {loading ? "Loading..." : "Fetch Activities"}
            </Button>
          </div>
        </Card>

        {fetchPerformed && currentTableData.length === 0 && (
          <p className="text-center text-lg mt-8 text-gray-500 dark:text-gray-400">
            No data found, please try again.
          </p>
        )}

        {currentTableData.length > 0 && (
          <div>
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

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Detailed Activity Table</h2>
              <Card className="overflow-auto p-4">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b p-2">Wallet</th>
                        <th className="border-b p-2">Token</th>
                        <th className="border-b p-2">Mint Address</th>
                        <th className="border-b p-2">Type</th>
                        <th className="border-b p-2">Amount</th>
                        <th className="border-b p-2">Date</th>
                        <th className="border-b p-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((a, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border-b">{a.wallet}</td>
                          <td className="p-2 border-b">{`${a.token} (${a.symbol})`}</td>
                          <td className="p-2 border-b">{a.mint}</td>
                          <td className="p-2 border-b">{a.type}</td>
                          <td className="p-2 border-b">{a.amount}</td>
                          <td className="p-2 border-b">
                            {a.timestamp ? new Date(a.timestamp).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="p-2 border-b">
                            {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger />
          <DialogContent className="bg-white dark:bg-black">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">No Wallet Address Provided</DialogTitle>
              <DialogDescription className="text-gray-700 dark:text-gray-300">
                Please enter at least one wallet address to fetch activity data.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WalletActivityDashboard;
