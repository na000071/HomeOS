import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
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
      <div className="flex min-h-screen bg-[#F7F5F0]">
        <Sidebar />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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