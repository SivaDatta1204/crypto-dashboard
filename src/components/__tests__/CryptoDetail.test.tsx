import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CryptoDetail } from "../../pages/CryptoDetail";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

// Mock the router params
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "bitcoin",
  }),
  useNavigate: () => jest.fn(),
}));

// Mock axios with both successful and error cases
const mockAxios = {
  get: jest.fn(),
};

jest.mock("axios", () => ({
  get: (...args: unknown[]) => mockAxios.get(...args),
}));

describe("CryptoDetail", () => {
  beforeEach(() => {
    mockAxios.get.mockReset();
  });

  it("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <CryptoDetail />
      </BrowserRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
