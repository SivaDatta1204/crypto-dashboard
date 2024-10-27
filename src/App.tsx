import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CryptoTable, CryptoDetail } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <div className="w-screen min-h-screen bg-gray-100">
        <header className="shadow-lg bg-gradient-to-r from-purple-600 to-blue-500">
          <div className="px-4 py-6 mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-white">Crypto Dashboard</h1>
            <p className="mt-2 text-purple-100">
              Track your favorite cryptocurrencies in real-time
            </p>
          </div>
        </header>

        <main className="px-4 py-8 mx-auto max-w-7xl">
          <Routes>
            <Route path="/" element={<CryptoTable />} />
            <Route path="/crypto/:id" element={<CryptoDetail />} />
          </Routes>
        </main>

        <footer className="mt-12 bg-white border-t border-gray-200">
          <div className="px-4 py-6 mx-auto max-w-7xl">
            <p className="text-center text-gray-600">
              Powered by CoinCap API • Updated in real-time
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
