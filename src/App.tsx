import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Explorer from "./pages/explorer";
import { ToastProvider } from "./contexts/ToastContext";
import { StoreProvider } from "./contexts/StoreContext";

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
        </Routes>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;
