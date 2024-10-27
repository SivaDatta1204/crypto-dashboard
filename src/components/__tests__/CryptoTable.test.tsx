// CryptoTable.test.tsx
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CryptoTable } from "../../pages/CryptoTable";
import "@testing-library/jest-dom";

const mockCryptoData = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    priceUsd: "50000",
    marketCapUsd: "1000000000",
    rank: "1",
    changePercent24Hr: "5.23",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    priceUsd: "3000",
    marketCapUsd: "500000000",
    rank: "2",
    changePercent24Hr: "-2.5",
  },
];

jest.mock("../../hooks/useCryptoData", () => ({
  useCryptoData: () => ({
    cryptos: mockCryptoData,
    loading: false,
    error: null,
  }),
}));

jest.mock("../../hooks/useCryptoWebSocket", () => ({
  useCryptoWebSocket: () => ({
    bitcoin: "50000",
    ethereum: "3000",
  }),
}));

const mockToggleFavorite = jest.fn();
jest.mock("../../hooks/useFavorites", () => ({
  useFavorites: () => ({
    favorites: ["bitcoin"],
    toggleFavorite: mockToggleFavorite,
  }),
}));

describe("CryptoTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles sorting for symbol column", () => {
    render(
      <BrowserRouter>
        <CryptoTable />
      </BrowserRouter>
    );

    const symbolHeader = screen.getByRole("columnheader", { name: /symbol/i });
    fireEvent.click(symbolHeader);

    const rows = screen.getAllByRole("row");
    expect(within(rows[1]).getByText("BTC")).toBeInTheDocument();
  });

  it("toggles favorites correctly", () => {
    render(
      <BrowserRouter>
        <CryptoTable />
      </BrowserRouter>
    );

    const favoriteButtons = screen.getAllByRole("button", {
      name: /favorite/i,
    });
    const bitcoinFavoriteButton = favoriteButtons[0];
    fireEvent.click(bitcoinFavoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith("bitcoin");
  });

  it("displays loading state", () => {
    // Override the mock for this specific test
    jest
      .spyOn(require("../../hooks/useCryptoData"), "useCryptoData")
      .mockImplementation(() => ({
        cryptos: [],
        loading: true,
        error: null,
      }));

    render(
      <BrowserRouter>
        <CryptoTable />
      </BrowserRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error state", () => {
    // Override the mock for this specific test
    jest
      .spyOn(require("../../hooks/useCryptoData"), "useCryptoData")
      .mockImplementation(() => ({
        cryptos: [],
        loading: false,
        error: "Failed to fetch data",
      }));

    render(
      <BrowserRouter>
        <CryptoTable />
      </BrowserRouter>
    );

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });
});
