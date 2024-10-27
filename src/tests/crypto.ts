export interface Crypto {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  changePercent24Hr: string;
  supply: string;
  maxSupply: string;
  volumeUsd24Hr: string;
  vwap24Hr: string;
}

export interface CryptoResponse {
  data: Crypto[];
  timestamp: number;
}

export interface PriceHistory {
  priceUsd: string;
  time: number;
  date: string;
}

export interface PriceHistoryResponse {
  data: PriceHistory[];
  timestamp: number;
}

export interface WebSocketPrice {
  [key: string]: string;
}
