import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { useCryptoData } from "../hooks/useCryptoData";
import { useFavorites } from "../hooks/useFavorites";
import { useCryptoWebSocket } from "../hooks/useCryptoWebSocket";
import { formatLargeNumber } from "../utils/common-utils";

export const CryptoTable = () => {
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: "symbol" | "name" | "rank";
    direction: "asc" | "desc";
  }>({ key: "rank", direction: "asc" });

  const { cryptos, loading, error } = useCryptoData();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [isFavouritesEnabled, setIsFavouritesEnabled] = useState(false);
  const liveData = useCryptoWebSocket(cryptos.map((c) => c.id));

  const ITEMS_PER_PAGE = 10;
  const TABLE_ROW_HEIGHT = 64;

  const sortedCryptos = [...cryptos].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key].localeCompare(b[sortConfig.key]);
    }
    return b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });

  const filteredCryptos = sortedCryptos.filter((crypto) =>
    isFavouritesEnabled ? favorites.includes(crypto.id) : true
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCryptos.length / ITEMS_PER_PAGE)
  );
  const paginatedCryptos = filteredCryptos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const emptyRows = Array(
    Math.max(0, ITEMS_PER_PAGE - paginatedCryptos.length)
  ).fill(null);

  const handleSort = (key: "symbol" | "name" | "rank") => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Reset page when toggling favorites
  const handleFavoritesToggle = () => {
    setIsFavouritesEnabled((prev) => !prev);
    setPage(1); // Explicitly reset to page 1
  };

  // Ensure page is valid whenever filtered data changes
  useEffect(() => {
    setPage(1);
  }, [isFavouritesEnabled]); // Reset page when favorites filter changes

  if (loading)
    return (
      <div className="w-full overflow-hidden bg-white shadow-xl rounded-xl">
        <div
          className="flex items-center justify-center"
          style={{ height: `${TABLE_ROW_HEIGHT * ITEMS_PER_PAGE}px` }}
        >
          <div className="w-16 h-16 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="w-full overflow-hidden bg-white shadow-xl rounded-xl">
        <div
          className="flex items-center justify-center"
          style={{ height: `${TABLE_ROW_HEIGHT * ITEMS_PER_PAGE}px` }}
        >
          <div className="p-4 border-l-4 border-red-500 rounded-lg bg-red-50">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full overflow-hidden bg-white shadow-xl rounded-xl">
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[640px]">
          {" "}
          {/* Set minimum width for mobile */}
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-500">
            <tr className="text-white">
              <th className="px-4 py-4 w-24 min-w-[96px]">
                <div className="flex items-center space-x-2">
                  <span>Favorites</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoritesToggle();
                    }}
                    className="transition-transform hover:scale-110"
                  >
                    {isFavouritesEnabled ? (
                      <Star
                        className="w-5 h-5 text-yellow-400"
                        style={{ fill: "currentColor" }}
                      />
                    ) : (
                      <Star
                        className="w-5 h-5 text-gray-400"
                        style={{ fill: "none" }}
                      />
                    )}
                  </button>
                </div>
              </th>
              <th
                className="px-4 py-4 text-left w-24 min-w-[96px] cursor-pointer hover:bg-white/10"
                onClick={() => handleSort("symbol")}
              >
                <div className="flex items-center space-x-2">
                  <span>Symbol</span>
                  {sortConfig.key === "symbol" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-4 text-left flex-1 w-32 min-w-[128px] cursor-pointer hover:bg-white/10"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-2">
                  <span>Name</span>
                  {sortConfig.key === "name" && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-4 text-right w-32 min-w-[128px]">
                Price (USD)
              </th>
              <th className="hidden px-4 py-4 text-right w-40 min-w-[160px] lg:table-cell">
                Market Cap (USD)
              </th>
              <th className="px-4 py-4 text-right w-32 min-w-[128px]">
                24h Change
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y divide-gray-100"
            style={{ minHeight: `${TABLE_ROW_HEIGHT * ITEMS_PER_PAGE}px` }}
          >
            {paginatedCryptos.map((crypto) => {
              const price = liveData[crypto.id] || Number(crypto.priceUsd);
              const priceChange = Number(crypto.changePercent24Hr);
              return (
                <tr
                  key={crypto.id}
                  className="transition-colors cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/crypto/${crypto.id}`)}
                  style={{ height: `${TABLE_ROW_HEIGHT}px` }}
                >
                  <td className="px-4 py-4">
                    <button
                      aria-label="favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(crypto.id);
                      }}
                      className="transition-transform hover:scale-110"
                    >
                      {favorites.includes(crypto.id) ? (
                        <Star
                          className="w-5 h-5 text-yellow-400"
                          style={{ fill: "currentColor" }}
                        />
                      ) : (
                        <Star
                          className="w-5 h-5 text-gray-400"
                          style={{ fill: "none" }}
                        />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-black bg-gray-100 rounded-full">
                      {crypto.symbol}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-black">
                    {crypto.name}
                  </td>
                  <td className="px-4 py-4 font-mono text-right text-black">
                    ${price}
                  </td>
                  <td className="hidden px-4 py-4 font-mono text-right text-black lg:table-cell">
                    {formatLargeNumber(crypto.marketCapUsd)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                        priceChange >= 0
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {priceChange >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(priceChange).toFixed(2)}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* Add empty rows to maintain fixed height */}
            {emptyRows.map((_, index) => (
              <tr
                key={`empty-${index}`}
                style={{ height: `${TABLE_ROW_HEIGHT}px` }}
                className="bg-gray-50"
              >
                <td colSpan={6} className="px-4 py-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
        <button
          className="px-4 py-2 font-medium text-white transition-all duration-200 transform rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="font-medium text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 font-medium text-white transition-all duration-200 transform rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoTable;
