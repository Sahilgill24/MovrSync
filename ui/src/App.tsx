import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
 import { PetraWallet } from "petra-plugin-wallet-adapter";
 import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

function App() {
   const wallets = [new PetraWallet()];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
    <ThemeProvider defaultTheme="dark">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </AptosWalletAdapterProvider>
  );
}

export default App;
