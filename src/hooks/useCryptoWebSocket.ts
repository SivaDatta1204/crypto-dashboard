import { useState, useEffect } from "react";
import type { WebSocketPrice } from "../tests";

export const useCryptoWebSocket = (assets: string[]) => {
  const [prices, setPrices] = useState<WebSocketPrice>({});

  useEffect(() => {
    if (assets.length === 0) return;

    const ws = new WebSocket(
      `wss://ws.coincap.io/prices?assets=${assets.join(",")}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices((prev) => ({ ...prev, ...data }));
    };

    return () => ws.close();
  }, [assets]);

  return prices;
};
