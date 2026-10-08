import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import GlobalSearch from "./components/GlobalSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { HomeDataProvider } from "./context/HomeDataProvider";

import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import MyHome from "./pages/MyHome";
import Appliances from "./pages/Appliances";
import Maintenance from "./pages/Maintenance";
import Warranties from "./pages/Warranties";
import Expenses from "./pages/Expenses";
import Documents from "./pages/Documents";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function FeatureRoutes() {
  return (
    <HomeDataProvider>
      <div className="flex min-h-screen flex-col bg-transparent md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <GlobalSearch />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<MyHome />} />
            <Route path="/appliances" element={<Appliances />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/warranties" element={<Warranties />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HomeDataProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <FeatureRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;