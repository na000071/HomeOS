import Card from "../components/Card";
import { overviewData } from "../data/dashboardData";

function Dashboard() {
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
            {overviewData.map((item) => (
                <Card key={item.title} className="p-5">
                <p className="text-sm text-stone-500">
                    {item.title}
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#20211F]">
                    {item.value}
                </p>

                <p className="mt-1 text-sm text-stone-500">
                    {item.description}
                </p>
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
                Stay ahead of important tasks around your home.
              </p>
            </div>
  
            <button className="text-sm font-medium text-[#5E7563] hover:underline">
              View all
            </button>
          </div>
  
          <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-white">
            {/* Maintenance Item */}
            <div className="flex items-center justify-between border-b border-stone-100 p-5">
              <div>
                <h3 className="font-medium text-[#20211F]">
                  Change HVAC filter
                </h3>
  
                <p className="mt-1 text-sm text-stone-500">
                  Heating & Cooling
                </p>
              </div>
  
              <div className="text-right">
                <p className="text-sm font-medium text-amber-600">
                  Due in 3 days
                </p>
  
                <p className="mt-1 text-xs text-stone-400">
                  Sep 25, 2026
                </p>
              </div>
            </div>
  
            {/* Maintenance Item */}
            <div className="flex items-center justify-between border-b border-stone-100 p-5">
              <div>
                <h3 className="font-medium text-[#20211F]">
                  Clean dishwasher filter
                </h3>
  
                <p className="mt-1 text-sm text-stone-500">
                  Kitchen
                </p>
              </div>
  
              <div className="text-right">
                <p className="text-sm font-medium text-stone-600">
                  Due in 10 days
                </p>
  
                <p className="mt-1 text-xs text-stone-400">
                  Oct 2, 2026
                </p>
              </div>
            </div>
  
            {/* Maintenance Item */}
            <div className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-medium text-[#20211F]">
                  Test smoke detectors
                </h3>
  
                <p className="mt-1 text-sm text-stone-500">
                  Whole Home
                </p>
              </div>
  
              <div className="text-right">
                <p className="text-sm font-medium text-stone-600">
                  Due in 14 days
                </p>
  
                <p className="mt-1 text-xs text-stone-400">
                  Oct 6, 2026
                </p>
              </div>
            </div>
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

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Active Warranty */}
            <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-stone-500">
                    Refrigerator
                    </p>

                    <h3 className="mt-1 font-medium text-[#20211F]">
                    Samsung
                    </h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                </span>
                </div>

                <div className="mt-6">
                <p className="text-xs text-stone-400">
                    Warranty expires
                </p>

                <p className="mt-1 text-sm font-medium text-[#20211F]">
                    March 18, 2028
                </p>
                </div>
            </div>

            {/* Expiring Soon */}
            <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-stone-500">
                    Washing Machine
                    </p>

                    <h3 className="mt-1 font-medium text-[#20211F]">
                    LG
                    </h3>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    Expiring Soon
                </span>
                </div>

                <div className="mt-6">
                <p className="text-xs text-stone-400">
                    Warranty expires
                </p>

                <p className="mt-1 text-sm font-medium text-[#20211F]">
                    November 12, 2026
                </p>
                </div>
            </div>

            {/* Active Warranty */}
            <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-stone-500">
                    Dishwasher
                    </p>

                    <h3 className="mt-1 font-medium text-[#20211F]">
                    Bosch
                    </h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                </span>
                </div>

                <div className="mt-6">
                <p className="text-xs text-stone-400">
                    Warranty expires
                </p>

                <p className="mt-1 text-sm font-medium text-[#20211F]">
                    July 4, 2029
                </p>
                </div>
            </div>
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

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Total Expenses */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
                <p className="text-sm text-stone-500">
                This Month
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#20211F]">
                $428.50
                </p>

                <p className="mt-2 text-sm text-stone-500">
                Home-related expenses
                </p>
            </div>

            {/* Expense Breakdown */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                <h3 className="font-medium text-[#20211F]">
                    Spending Breakdown
                </h3>

                <span className="text-xs text-stone-400">
                    September 2026
                </span>
                </div>

                <div className="mt-6 space-y-5">
                {/* Utilities */}
                <div>
                    <div className="mb-2 flex justify-between text-sm">
                    <span className="text-stone-600">
                        Utilities
                    </span>

                    <span className="font-medium text-[#20211F]">
                        $180
                    </span>
                    </div>

                    <div className="h-2 rounded-full bg-stone-100">
                    <div
                        className="h-2 rounded-full bg-[#5E7563]"
                        style={{ width: "70%" }}
                    />
                    </div>
                </div>

                {/* Maintenance */}
                <div>
                    <div className="mb-2 flex justify-between text-sm">
                    <span className="text-stone-600">
                        Maintenance
                    </span>

                    <span className="font-medium text-[#20211F]">
                        $148.50
                    </span>
                    </div>

                    <div className="h-2 rounded-full bg-stone-100">
                    <div
                        className="h-2 rounded-full bg-[#5E7563]"
                        style={{ width: "55%" }}
                    />
                    </div>
                </div>

                {/* Internet */}
                <div>
                    <div className="mb-2 flex justify-between text-sm">
                    <span className="text-stone-600">
                        Internet
                    </span>

                    <span className="font-medium text-[#20211F]">
                        $100
                    </span>
                    </div>

                    <div className="h-2 rounded-full bg-stone-100">
                    <div
                        className="h-2 rounded-full bg-[#5E7563]"
                        style={{ width: "35%" }}
                    />
                    </div>
                </div>
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
                {/* Reminder 1 */}
                <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start gap-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />

                    <div>
                    <h3 className="font-medium text-[#20211F]">
                        Washing machine warranty expires
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                        November 12, 2026
                    </p>
                    </div>
                </div>
                </div>

                {/* Reminder 2 */}
                <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start gap-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5E7563]" />

                    <div>
                    <h3 className="font-medium text-[#20211F]">
                        Replace HVAC filter
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                        September 25, 2026
                    </p>
                    </div>
                </div>
                </div>

                {/* Reminder 3 */}
                <div className="rounded-xl border border-stone-200 bg-white p-5">
                <div className="flex items-start gap-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5E7563]" />

                    <div>
                    <h3 className="font-medium text-[#20211F]">
                        Home insurance renewal
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                        December 1, 2026
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
      </div>
    );
  }
  
  export default Dashboard;