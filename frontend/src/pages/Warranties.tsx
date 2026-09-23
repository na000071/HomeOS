import Card from "../components/Card";
import { warrantiesData } from "../data/warrantiesData";

function Warranties() {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Protection & coverage</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Warranties
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep track of appliance warranties and expiration dates.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Warranty
          </button>
        </div>
  
        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Active</p>
  
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">
              5
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              Current warranties
            </p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Expiring Soon</p>
  
            <p className="mt-2 text-3xl font-semibold text-amber-600">
              2
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              Within 90 days
            </p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Expired</p>
  
            <p className="mt-2 text-3xl font-semibold text-red-600">
              1
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              No longer active
            </p>
          </div>
        </div>
  
        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search warranties..."
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#5E7563]"
          />
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
          </select>
        </div>
  
        {/* Warranty List */}
        <section className="mt-6">
         <div className="mt-6 space-y-3">
            {warrantiesData.map((warranty) => (
                <Card key={warranty.id} className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-medium text-[#20211F]">
                        {warranty.brand} {warranty.appliance}
                        </h2>

                        <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            warranty.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : warranty.status === "Expiring Soon"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-stone-100 text-stone-600"
                        }`}
                        >
                        {warranty.status}
                        </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
                        <div>
                        <p className="text-stone-400">Model</p>
                        <p className="mt-1 text-stone-700">
                            {warranty.model}
                        </p>
                        </div>

                        <div>
                        <p className="text-stone-400">Room</p>
                        <p className="mt-1 text-stone-700">
                            {warranty.room}
                        </p>
                        </div>

                        <div>
                        <p className="text-stone-400">Purchased</p>
                        <p className="mt-1 text-stone-700">
                            {warranty.purchaseDate}
                        </p>
                        </div>

                        <div>
                        <p className="text-stone-400">
                            {warranty.status === "Expired" ? "Expired" : "Expires"}
                        </p>

                        <p
                            className={`mt-1 font-medium ${
                            warranty.status === "Expiring Soon"
                                ? "text-amber-600"
                                : warranty.status === "Expired"
                                ? "text-stone-600"
                                : "text-stone-700"
                            }`}
                        >
                            {warranty.expiryDate}
                        </p>
                        </div>
                    </div>
                    </div>

                    <button className="text-left text-sm font-medium text-[#5E7563] hover:underline lg:text-right">
                    View Warranty →
                    </button>
                </div>
                </Card>
            ))}
         </div>
        </section>
      </div>
    );
  }
  
  export default Warranties;