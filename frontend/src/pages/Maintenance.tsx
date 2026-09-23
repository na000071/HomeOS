import Card from "../components/Card";
import { maintenanceData } from "../data/maintenanceData";

function Maintenance() {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Home care</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Maintenance
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep track of recurring tasks and important home maintenance.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Task
          </button>
        </div>
  
        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Upcoming</p>
  
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">
              5
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              Tasks scheduled
            </p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Due Soon</p>
  
            <p className="mt-2 text-3xl font-semibold text-amber-600">
              3
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              Within 14 days
            </p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Overdue</p>
  
            <p className="mt-2 text-3xl font-semibold text-red-600">
              1
            </p>
  
            <p className="mt-1 text-sm text-stone-500">
              Needs attention
            </p>
          </div>
        </div>
  
        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Tasks</option>
            <option>Upcoming</option>
            <option>Due Soon</option>
            <option>Overdue</option>
            <option>Completed</option>
          </select>
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Rooms</option>
            <option>Kitchen</option>
            <option>Bedroom</option>
            <option>Living Room</option>
            <option>Whole Home</option>
          </select>
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Frequencies</option>
            <option>One-time</option>
            <option>Monthly</option>
            <option>Every 3 Months</option>
            <option>Yearly</option>
          </select>
        </div>
  
        {/* Maintenance Tasks */}
        <section className="mt-6">
          <div className="mt-6 space-y-3">
            {maintenanceData.map((task) => (
                <Card key={task.id} className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                    <div className="flex items-center gap-3">
                        <h2 className="font-medium text-[#20211F]">
                        {task.title}
                        </h2>

                        <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            task.status === "Overdue"
                            ? "bg-red-50 text-red-700"
                            : task.status === "Due Soon"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-stone-100 text-stone-600"
                        }`}
                        >
                        {task.status}
                        </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                        <span>{task.room}</span>
                        <span>{task.frequency}</span>
                    </div>
                    </div>

                    <div className="text-left md:text-right">
                    <p className="text-sm text-stone-400">Due date</p>

                    <p
                        className={`mt-1 text-sm font-medium ${
                        task.status === "Overdue"
                            ? "text-red-600"
                            : task.status === "Due Soon"
                            ? "text-amber-600"
                            : "text-stone-700"
                        }`}
                    >
                        {task.dueDate}
                    </p>
                    </div>
                </div>
                </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }
  
  export default Maintenance;