import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Dashboard", path: "/" },
  { name: "My Home", path: "/home" },
  { name: "Appliances", path: "/appliances" },
  { name: "Maintenance", path: "/maintenance" },
  { name: "Warranties", path: "/warranties" },
  { name: "Expenses", path: "/expenses" },
  { name: "Documents", path: "/documents" },
  { name: "Reminders", path: "/reminders" },
];

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-stone-200 bg-[#F7F5F0] p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[#20211F]">
          HOMEOS
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Your home, organized.
        </p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-[#5E7563] text-white"
                      : "text-stone-600 hover:bg-stone-200 hover:text-[#20211F]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button className="rounded-lg px-4 py-3 text-left text-sm text-stone-600 hover:bg-stone-200">
        Settings
      </button>
    </aside>
  );
}

export default Sidebar;