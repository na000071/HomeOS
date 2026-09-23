function Reminders() {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Stay on top of things</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Reminders
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep track of important dates and upcoming home tasks.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Reminder
          </button>
        </div>
  
        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Upcoming</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">5</p>
            <p className="mt-1 text-sm text-stone-500">Next 30 days</p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Due Soon</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">2</p>
            <p className="mt-1 text-sm text-stone-500">Within 7 days</p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Overdue</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">1</p>
            <p className="mt-1 text-sm text-stone-500">Needs attention</p>
          </div>
        </div>
  
        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Reminders</option>
            <option>Maintenance</option>
            <option>Warranty</option>
            <option>Bill</option>
            <option>Insurance</option>
            <option>Other</option>
          </select>
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Dates</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Next 3 Months</option>
          </select>
        </div>
  
        {/* Reminder List */}
        <section className="mt-6">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
  
            {/* Reminder 1 */}
            <div className="flex flex-col gap-4 border-b border-stone-100 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
  
                <div>
                  <h2 className="font-medium text-[#20211F]">
                    Replace HVAC Filter
                  </h2>
  
                  <p className="mt-1 text-sm text-stone-500">
                    Maintenance · Whole Home
                  </p>
  
                  <p className="mt-2 text-sm font-medium text-amber-600">
                    Due September 25, 2026
                  </p>
                </div>
              </div>
  
              <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View Task →
              </button>
            </div>
  
            {/* Reminder 2 */}
            <div className="flex flex-col gap-4 border-b border-stone-100 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
  
                <div>
                  <h2 className="font-medium text-[#20211F]">
                    Washing Machine Warranty
                  </h2>
  
                  <p className="mt-1 text-sm text-stone-500">
                    Warranty · LG Washing Machine
                  </p>
  
                  <p className="mt-2 text-sm font-medium text-amber-600">
                    Expires November 12, 2026
                  </p>
                </div>
              </div>
  
              <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View Warranty →
              </button>
            </div>
  
            {/* Reminder 3 */}
            <div className="flex flex-col gap-4 border-b border-stone-100 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-stone-400" />
  
                <div>
                  <h2 className="font-medium text-[#20211F]">
                    Home Insurance Renewal
                  </h2>
  
                  <p className="mt-1 text-sm text-stone-500">
                    Insurance · Home Insurance
                  </p>
  
                  <p className="mt-2 text-sm text-stone-600">
                    Due December 1, 2026
                  </p>
                </div>
              </div>
  
              <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View Document →
              </button>
            </div>
  
            {/* Reminder 4 */}
            <div className="flex flex-col gap-4 border-b border-stone-100 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-stone-400" />
  
                <div>
                  <h2 className="font-medium text-[#20211F]">
                    Test Smoke Detectors
                  </h2>
  
                  <p className="mt-1 text-sm text-stone-500">
                    Maintenance · Whole Home
                  </p>
  
                  <p className="mt-2 text-sm text-stone-600">
                    Due October 6, 2026
                  </p>
                </div>
              </div>
  
              <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View Task →
              </button>
            </div>
  
            {/* Reminder 5 */}
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-red-500" />
  
                <div>
                  <h2 className="font-medium text-[#20211F]">
                    Replace Water Filter
                  </h2>
  
                  <p className="mt-1 text-sm text-stone-500">
                    Maintenance · Kitchen
                  </p>
  
                  <p className="mt-2 text-sm font-medium text-red-600">
                    Overdue · September 15, 2026
                  </p>
                </div>
              </div>
  
              <button className="text-sm font-medium text-[#5E7563] hover:underline">
                View Task →
              </button>
            </div>
  
          </div>
        </section>
  
        {/* Smart Reminders */}
        <section className="mt-8 rounded-xl border border-stone-200 bg-[#E8E1D5] p-6">
          <p className="text-sm font-medium text-[#5E7563]">
            Future feature
          </p>
  
          <h2 className="mt-2 text-xl font-semibold text-[#20211F]">
            Smart reminders
          </h2>
  
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            HomeOS will eventually create useful reminders automatically from
            maintenance schedules, warranty dates, documents, and recurring
            expenses.
          </p>
        </section>
      </div>
    );
  }
  
  export default Reminders;