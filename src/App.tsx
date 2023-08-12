import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Root from "./pages/root";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
