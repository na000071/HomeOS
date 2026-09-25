import Card from "../components/Card";
import WarrantyStatusBadge from "../components/WarrantyStatusBadge";
import { useHomeData } from "../context/useHomeData";
import { getMaintenanceDashboardData } from "../utils/maintenanceDashboard";
import { getExpenseDashboardData } from "../utils/expenseDashboard";
import { getWarrantyDashboardData } from "../utils/warrantyDashboard";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Dashboard() {
  const { appliances, maintenanceTasks, warranties, expenses } = useHomeData();
  const warrantyDashboard = getWarrantyDashboardData(warranties);
  const maintenanceDashboard = getMaintenanceDashboardData(maintenanceTasks);
  const expenseDashboard = getExpenseDashboardData(expenses);
    return (
      <div>
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Good morning</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Your Home
            </h1>
  
            <p className="mt-2 text-stone-500">
              Here’s an overview of everything you’re keeping track of.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Item
          </button>
        </div>
  
        {/* Overview Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Appliances", appliances.length, "Total appliances"],
            ["Maintenance", maintenanceDashboard.total, "Total maintenance tasks"],
            ["Warranties", warrantyDashboard.total, "Total warranties"],
            ["Expenses", `$${expenseDashboard.total.toFixed(2)}`, "Tracked expenses"],
          ].map(([title, value, description]) => (
            <Card key={title} className="p-5">
              <p className="text-sm text-stone-500">{title}</p>
              <p className="mt-2 text-3xl font-semibold text-[#20211F]">{value}</p>
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            </Card>
          ))}
        </div>
  
        {/* Upcoming Maintenance */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#20211F]">
                Upcoming Maintenance
              </h2>
  
              <p className="mt-1 text-sm text-stone-500">
                {maintenanceDashboard.upcoming} upcoming · {maintenanceDashboard.overdue} overdue
              </p>
            </div>
  
            <button className="text-sm font-medium text-[#5E7563] hover:underline">
              View all
            </button>
          </div>
  
          <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-white">
            {maintenanceDashboard.upcomingTasks.slice(0, 3).map((task, index) => (
              <div
                key={task.id}
                className={`flex items-center justify-between gap-4 p-5 ${index < Math.min(maintenanceDashboard.upcomingTasks.length, 3) - 1 ? "border-b border-stone-100" : ""}`}
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-[#20211F]">{task.title}</h3>
                  <p className="mt-1 text-sm text-stone-500">{task.room}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-stone-600">{task.status}</p>
                  <p className="mt-1 text-xs text-stone-400">{task.dueDate}</p>
                </div>
              </div>
            ))}
            {maintenanceDashboard.upcomingTasks.length === 0 && (
              <p className="p-5 text-sm text-stone-500">No upcoming maintenance tasks.</p>
            )}
          </div>
        </section>

        {/* Warranty Overview */}
        <section className="mt-8">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-[#20211F]">
                Warranty Overview
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                Keep track of warranties that are active or expiring soon.
                </p>
            </div>

            <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View all
            </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Warranties", warrantyDashboard.total, "All tracked warranties"],
                ["Active", warrantyDashboard.active, "Current coverage"],
                ["Expiring Soon", warrantyDashboard.expiringSoon, "Within 90 days"],
                ["Expired", warrantyDashboard.expired, "No longer active"],
              ].map(([label, value, description]) => (
                <Card key={label} className="p-5">
                  <p className="text-sm text-stone-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-[#20211F]">{value}</p>
                  <p className="mt-1 text-sm text-stone-500">{description}</p>
                </Card>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#20211F]">Upcoming Warranties</h3>
                  <p className="mt-1 text-sm text-stone-500">Coverage that needs attention soon.</p>
                </div>
                <span className="text-sm text-stone-500">
                  {warrantyDashboard.recentlyExpiring.length} upcoming
                </span>
              </div>

              {warrantyDashboard.recentlyExpiring.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {warrantyDashboard.recentlyExpiring.map((warranty) => (
                    <div
                      key={warranty.id}
                      className="flex flex-col gap-3 rounded-lg border border-stone-100 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-[#20211F]">
                          {warranty.applianceBrand} {warranty.applianceName}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">{warranty.provider}</p>
                      </div>
                      <div className="flex items-center gap-3 sm:text-right">
                        <div>
                          <p className="text-sm font-medium text-amber-700">
                            {warranty.daysRemaining} days remaining
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            Expires {warranty.expirationDateLabel}
                          </p>
                        </div>
                        <WarrantyStatusBadge status={warranty.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-lg bg-stone-50 p-4 text-sm text-stone-500">
                  No warranties need attention soon.
                </p>
              )}
            </div>
        </section>

        {/* Expenses Summary */}
        <section className="mt-8">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold text-[#20211F]">
                Expenses
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                A quick look at your home-related spending.
                </p>
            </div>

            <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View all
            </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Total Expenses", expenseDashboard.total],
                ["This Month", expenseDashboard.thisMonth],
                ["This Year", expenseDashboard.thisYear],
              ].map(([label, amount]) => (
                <Card key={label} className="p-5">
                  <p className="text-sm text-stone-500">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#20211F]">
                    {currencyFormatter.format(amount as number)}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="font-medium text-[#20211F]">Recent Expenses</h3>
                <div className="mt-4 space-y-3">
                  {expenseDashboard.recentExpenses.length > 0 ? expenseDashboard.recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#20211F]">{expense.description}</p>
                        <p className="mt-1 text-xs text-stone-500">{expense.category} · {expense.date}</p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-stone-800">{currencyFormatter.format(expense.amount)}</p>
                    </div>
                  )) : <p className="text-sm text-stone-500">No expenses recorded yet.</p>}
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="font-medium text-[#20211F]">Top Expense Categories</h3>
                <div className="mt-4 space-y-4">
                  {expenseDashboard.topCategories.length > 0 ? expenseDashboard.topCategories.map((category) => (
                    <div key={category.category}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-stone-600">{category.category} · {category.count}</span>
                        <span className="font-medium text-[#20211F]">{currencyFormatter.format(category.amount)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-stone-100">
                        <div className="h-2 rounded-full bg-[#5E7563]" style={{ width: `${expenseDashboard.byCategory.find((item) => item.category === category.category)?.percentage ?? 0}%` }} />
                      </div>
                    </div>
                  )) : <p className="text-sm text-stone-500">No expense categories yet.</p>}
                </div>
              </div>
            </div>
        </section>
        {/* Documents and Reminders */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Documents */}
            <div>
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-xl font-semibold text-[#20211F]">
                    Recent Documents
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Your recently added home documents.
                </p>
                </div>

                <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View all
                </button>
            </div>

            <div className="mt-4 rounded-xl border border-stone-200 bg-white">
                {/* Document 1 */}
                <div className="flex items-center justify-between border-b border-stone-100 p-5">
                <div>
                    <h3 className="font-medium text-[#20211F]">
                    Refrigerator Receipt
                    </h3>

                    <p className="mt-1 text-xs text-stone-400">
                    Added Sep 18, 2026
                    </p>
                </div>

                <span className="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
                    Receipt
                </span>
                </div>

                {/* Document 2 */}
                <div className="flex items-center justify-between border-b border-stone-100 p-5">
                <div>
                    <h3 className="font-medium text-[#20211F]">
                    Dishwasher Warranty
                    </h3>

                    <p className="mt-1 text-xs text-stone-400">
                    Added Sep 15, 2026
                    </p>
                </div>

                <span className="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
                    Warranty
                </span>
                </div>

                {/* Document 3 */}
                <div className="flex items-center justify-between p-5">
                <div>
                    <h3 className="font-medium text-[#20211F]">
                    Home Insurance
                    </h3>

                    <p className="mt-1 text-xs text-stone-400">
                    Added Sep 10, 2026
                    </p>
                </div>

                <span className="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-600">
                    Insurance
                </span>
                </div>
            </div>
            </div>

            {/* Reminders */}
            <div>
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-xl font-semibold text-[#20211F]">
                    Reminders
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Important things coming up.
                </p>
                </div>

                <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View all
                </button>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ...warrantyDashboard.recentlyExpiring.slice(0, 2).map((warranty) => ({
                  title: `${warranty.applianceName} warranty expires`,
                  date: warranty.expirationDateLabel,
                  tone: "bg-amber-500",
                })),
                ...maintenanceDashboard.upcomingTasks.slice(0, 2).map((task) => ({
                  title: task.title,
                  date: task.dueDate,
                  tone: "bg-[#5E7563]",
                })),
              ].slice(0, 3).map((reminder) => (
                <div key={`${reminder.title}-${reminder.date}`} className="rounded-xl border border-stone-200 bg-white p-5">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${reminder.tone}`} />
                    <div>
                      <h3 className="font-medium text-[#20211F]">{reminder.title}</h3>
                      <p className="mt-1 text-sm text-stone-500">{reminder.date}</p>
                    </div>
                  </div>
                </div>
              ))}
              {warrantyDashboard.recentlyExpiring.length === 0 && maintenanceDashboard.upcomingTasks.length === 0 && (
                <p className="rounded-xl border border-dashed border-stone-300 p-5 text-sm text-stone-500">
                  No upcoming reminders.
                </p>
              )}
            </div>
            </div>
        </section>
      </div>
    );
  }
  
  export default Dashboard;