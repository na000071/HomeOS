import { expensesData } from "../data/expensesData";
import Card from "../components/Card";

function Expenses() {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Home finances</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Expenses
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep track of what you spend on your home.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Expense
          </button>
        </div>
  
        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">
              This Month
            </p>
  
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">
              $428.50
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              September 2026
            </p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">
              This Year
            </p>
  
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">
              $4,862.75
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              January–September
            </p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">
              Average Monthly
            </p>
  
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">
              $540.31
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              Based on this year
            </p>
          </div>
        </div>
  
        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search expenses..."
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#5E7563]"
          />
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Categories</option>
            <option>Utilities</option>
            <option>Maintenance</option>
            <option>Appliances</option>
            <option>Internet</option>
            <option>Insurance</option>
            <option>Other</option>
          </select>
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
  
        {/* Expense List */}
        <section className="mt-6">
         <div className="mt-6">
                <Card>
                    {expensesData.map((expense, index) => (
                    <div
                        key={expense.id}
                        className={`flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between ${
                        index !== expensesData.length - 1
                            ? "border-b border-stone-100"
                            : ""
                        }`}
                    >
                        <div>
                        <h2 className="font-medium text-[#20211F]">
                            {expense.name}
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                            {expense.category} · {expense.date}
                        </p>
                        </div>

                        <p className="font-medium text-[#20211F]">
                        ${expense.amount.toFixed(2)}
                        </p>
                    </div>
                    ))}
                </Card>
         </div>
        </section>
      </div>
    );
  }
  
  export default Expenses;