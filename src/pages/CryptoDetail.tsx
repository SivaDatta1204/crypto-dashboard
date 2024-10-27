// src/components/CryptoDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Clock,
} from "lucide-react";
import axios from "axios";
import type { Crypto, PriceHistoryResponse } from "../tests";
import { formatLargeNumber } from "../utils/common-utils";

export const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState<Crypto | null>(null);
  const [history, setHistory] = useState<PriceHistoryResponse["data"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailResponse, historyResponse] = await Promise.all([
          axios.get(`https://api.coincap.io/v2/assets/${id}`),
          axios.get(
            `https://api.coincap.io/v2/assets/${id}/history?interval=d1`
          ),
        ]);

        setCrypto(detailResponse.data.data);
        setHistory(historyResponse.data.data.slice(-30));
        setError(null);
      } catch (err) {
        setError("Failed to fetch cryptocurrency details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div
          data-testid="loading-spinner"
          className="w-16 h-16 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"
        ></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 border-l-4 border-red-500 rounded-lg bg-red-50">
        <p className="text-red-700">{error}</p>
      </div>
    );

  if (!crypto)
    return (
      <div className="p-8 text-center rounded-lg bg-gray-50">
        <p className="text-gray-600">Cryptocurrency not found</p>
      </div>
    );

  const priceChange = Number(crypto.changePercent24Hr);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">
            {new Date(label).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-lg font-bold text-purple-600">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 mx-auto space-y-6 max-w-7xl">
      <button
        onClick={() => navigate("/")}
        className="flex items-center px-4 py-2 mb-6 space-x-2 text-gray-700 transition-all duration-200 bg-white rounded-lg shadow-md hover:shadow-lg hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to List</span>
      </button>

      <div className="overflow-hidden bg-white shadow-xl rounded-xl">
        <div className="p-8 bg-gradient-to-r from-purple-600 to-blue-500">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            {crypto.name} ({crypto.symbol})
          </h1>
          <p className="text-purple-100">Rank #{crypto.rank}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="flex items-center mb-2 space-x-2 text-purple-600">
              <DollarSign className="w-5 h-5" />
              <h2 className="font-semibold">Current Price</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${Number(crypto.priceUsd).toFixed(2)}
            </p>
          </div>

          <div className="p-6 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="flex items-center mb-2 space-x-2 text-purple-600">
              <BarChart2 className="w-5 h-5" />
              <h2 className="font-semibold">Market Cap</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatLargeNumber(crypto.marketCapUsd)}
            </p>
          </div>

          <div className="p-6 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="flex items-center mb-2 space-x-2 text-purple-600">
              {priceChange >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <h2 className="font-semibold">24h Change</h2>
            </div>
            <p
              className={`text-2xl font-bold ${
                priceChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {priceChange.toFixed(2)}%
            </p>
          </div>

          <div className="p-6 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <div className="flex items-center mb-2 space-x-2 text-purple-600">
              <Clock className="w-5 h-5" />
              <h2 className="font-semibold">24h Volume</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${Number(crypto.volumeUsd24Hr).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Price History (Last 30 Days)
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(time) =>
                      new Date(time).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    stroke="#6B7280"
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(value) =>
                      `$${Number(value).toLocaleString()}`
                    }
                    stroke="#6B7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="priceUsd"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                  <Line
                    type="monotone"
                    dataKey="priceUsd"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Supply Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Supply</p>
                  <p className="px-6 py-4 font-medium text-black">
                    {Number(crypto.supply).toLocaleString()} {crypto.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Supply</p>
                  <p className="px-6 py-4 font-medium text-black">
                    {crypto.maxSupply
                      ? `${Number(crypto.maxSupply).toLocaleString()} ${
                          crypto.symbol
                        }`
                      : "Unlimited"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Price Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Market Cap Dominance</p>
                  <p className="px-6 py-4 font-medium text-black">
                    {(
                      (Number(crypto.marketCapUsd) / Number(crypto.supply)) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trading Volume</p>
                  <p className="px-6 py-4 font-medium text-black">
                    ${Number(crypto.volumeUsd24Hr).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
