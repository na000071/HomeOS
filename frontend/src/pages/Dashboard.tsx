import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useHomeData } from "../context/useHomeData";
import {
  getDashboardStats,
  getGreeting,
  getNeedsAttention,
  getRecentActivity,
  getUpcomingItems,
  type DashboardItem,
} from "../utils/dashboardUtils";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const toneClasses: Record<DashboardItem["tone"], string> = {
  danger: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-stone-200 bg-stone-50",
};

function DashboardHeader() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-stone-500">Home overview</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
          {getGreeting()}
        </h1>
        <p className="mt-2 text-stone-500">Here&apos;s what&apos;s happening with your home.</p>
      </div>
    </header>
  );
}

function DashboardItemList({ items, emptyMessage }: { items: DashboardItem[]; emptyMessage: string }) {
  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-stone-300 p-5 text-sm text-stone-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.key}
          to={item.href}
          className={`block rounded-xl border p-4 transition hover:border-[#9DB3A2] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 ${toneClasses[item.tone]}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-[#20211F]">{item.title}</p>
              <p className="mt-1 text-sm text-stone-600">{item.description}</p>
            </div>
            <span className="shrink-0 text-right text-xs text-stone-500">{item.meta}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function Dashboard() {
  const {
    appliances,
    rooms,
    maintenanceTasks,
    warranties,
    expenses,
    documents,
    reminders,
    isDataLoading,
    dataLoadError,
  } = useHomeData();

  const stats = getDashboardStats(
    appliances,
    rooms,
    maintenanceTasks,
    warranties,
    expenses,
    documents,
    reminders,
  );
  const needsAttention = getNeedsAttention(maintenanceTasks, warranties, reminders, appliances);
  const upcomingItems = getUpcomingItems(maintenanceTasks, warranties, expenses, reminders, appliances);
  const recentActivity = getRecentActivity(appliances, maintenanceTasks, expenses, documents);

  if (isDataLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-10">
        <DashboardHeader />
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Loading your home overview...
        </div>
      </div>
    );
  }

  if (dataLoadError) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-10">
        <DashboardHeader />
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {dataLoadError}
        </div>
      </div>
    );
  }

  const overviewStats = [
    ["Appliances", stats.appliances, "Total tracked appliances", "/appliances"],
    ["Upcoming maintenance", stats.upcomingMaintenance, "Tasks needing attention", "/maintenance"],
    ["Active warranties", stats.activeWarranties, "Current coverage", "/warranties"],
    ["Monthly expenses", currencyFormatter.format(stats.monthlyExpenses), "This calendar month", "/expenses"],
    ["Open reminders", stats.openReminders, "Not completed", "/reminders"],
    ["Documents", stats.documents, "Home records", "/documents"],
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <DashboardHeader />

      <section aria-labelledby="dashboard-stats-title">
        <h2 id="dashboard-stats-title" className="sr-only">Overview statistics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overviewStats.map(([label, value, description, href]) => (
            <Link key={label} to={href} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">
              <Card className="h-full p-5 transition hover:border-[#9DB3A2] hover:shadow-sm">
                <p className="text-sm text-stone-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-[#20211F]">{value}</p>
                <p className="mt-1 text-sm text-stone-500">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#20211F]">Needs Attention</h2>
              <p className="mt-1 text-sm text-stone-500">The records most likely to need action next.</p>
            </div>
            <Link to="/maintenance" className="text-sm font-medium text-[#5E7563] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563]">View records</Link>
          </div>
          <div className="mt-4">
            <DashboardItemList items={needsAttention} emptyMessage="Nothing needs your attention right now." />
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#20211F]">Upcoming</h2>
              <p className="mt-1 text-sm text-stone-500">The next important home dates and tasks.</p>
            </div>
            <Link to="/reminders" className="text-sm font-medium text-[#5E7563] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563]">View schedule</Link>
          </div>
          <div className="mt-4">
            <DashboardItemList items={upcomingItems} emptyMessage="Nothing is scheduled yet." />
          </div>
        </div>
      </section>

      <section aria-labelledby="home-overview-title">
        <div>
          <h2 id="home-overview-title" className="text-xl font-semibold text-[#20211F]">Home Overview</h2>
          <p className="mt-1 text-sm text-stone-500">A quick view of the home records you are managing.</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {([
            ["Rooms", stats.rooms, "/home"],
            ["Appliances", stats.appliances, "/appliances"],
            ["Without a room", stats.appliancesWithoutRoom, "/appliances"],
            ["Maintenance tasks", stats.maintenanceTasks, "/maintenance"],
            ["Active warranties", stats.activeWarranties, "/warranties"],
          ] as const).map(([label, value, href]) => (
            <Link key={label} to={href} className="rounded-xl border border-stone-200 bg-white p-4 transition hover:border-[#9DB3A2] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">
              <p className="text-sm text-stone-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#20211F]">{value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-activity-title">
        <div>
          <h2 id="recent-activity-title" className="text-xl font-semibold text-[#20211F]">Recent Activity</h2>
          <p className="mt-1 text-sm text-stone-500">The latest records from your home.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recentActivity.length > 0 ? recentActivity.map((activity) => (
            <Link key={activity.key} to={activity.href} className="rounded-xl border border-stone-200 bg-white p-4 transition hover:border-[#9DB3A2] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{activity.description}</p>
              <p className="mt-2 truncate font-medium text-[#20211F]">{activity.title}</p>
              <p className="mt-1 text-sm text-stone-500">{activity.date}</p>
            </Link>
          )) : (
            <p className="col-span-full rounded-xl border border-dashed border-stone-300 p-5 text-sm text-stone-500">No recent activity yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;