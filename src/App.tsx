import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Explorer from "./pages/explorer";
import { ToastProvider } from "./contexts/ToastContext";
import { StoreProvider } from "./contexts/StoreContext";
import ViewPdf from "./pages/viewPdf";

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="explorer">
            <Route index element={<Explorer />} />
            <Route path=":folderPath" element={<Explorer />} />
          </Route>
          <Route path="/pdfViewer/:pdfPath" element={<ViewPdf />} />
        </Routes>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;
