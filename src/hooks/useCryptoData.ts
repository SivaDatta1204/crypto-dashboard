import { useState, useEffect } from "react";
import axios from "axios";
import type { Crypto, CryptoResponse } from "../tests";

export const useCryptoData = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CryptoResponse>(
          "https://api.coincap.io/v2/assets"
        );
        setCryptos(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch cryptocurrency data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return { cryptos, loading, error };
};
