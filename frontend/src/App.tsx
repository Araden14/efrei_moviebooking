import { Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import LoginPage from "@/pages/login";
import IndexPage from "./pages";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<IndexPage />} path="/" />
    </Routes>
  );
}

export default App;
