import { Link, NavLink } from "react-router-dom";

const navigation = [
  { name: "Dashboard", path: "/dashboard" },
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
    <aside className="flex w-full shrink-0 flex-col border-b border-sky-200/80 bg-gradient-to-b from-[#eaf7ff]/95 via-[#d7effb]/95 to-[#c5e5f5]/95 p-4 backdrop-blur-sm md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-5">
      <div className="mb-5 border-b border-stone-200/80 px-3 pb-5 md:mb-10 md:pb-7">
        <Link
          to="/"
          aria-label="Go to HomeOS intro page"
          className="inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
        >
          <h1 className="homeos-gradient-text text-2xl font-semibold tracking-[0.08em]">
            HOMEOS
          </h1>
        </Link>

        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
          Your home, organized.
        </p>
      </div>

      <nav className="flex-1 overflow-x-auto">
        <ul className="flex gap-1.5 md:block md:space-y-1.5">
          {navigation.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                    `block whitespace-nowrap rounded-xl px-4 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 ${
                    isActive
                      ? "homeos-primary-button text-white shadow-[0_8px_20px_rgba(22,119,184,0.18)]"
                      : "text-sky-900/75 hover:bg-white/70 hover:text-sky-950"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button type="button" className="mt-4 hidden rounded-xl px-4 py-3 text-left text-sm text-stone-600 transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 md:mt-0 md:block">
        Settings
      </button>
    </aside>
  );
}

export default Sidebar;