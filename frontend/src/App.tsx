import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import MyHome from "./pages/MyHome";
import Appliances from "./pages/Appliances";
import Maintenance from "./pages/Maintenance";
import Warranties from "./pages/Warranties";
import Expenses from "./pages/Expenses";
import Documents from "./pages/Documents";
import Reminders from "./pages/Reminders";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-transparent md:flex-row">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;