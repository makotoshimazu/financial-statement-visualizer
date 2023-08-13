import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Root from "./pages/root";
import { PATHS } from "./lib/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.root} element={<Root />} />
        <Route path={PATHS.finantialStatement} element={<Root />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
