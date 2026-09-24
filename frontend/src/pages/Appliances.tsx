import { useState } from "react";
import AddApplianceForm from "../components/AddApplianceForm";
import Button from "../components/Button";
import { appliancesData } from "../data/appliancesData";
import Card from "../components/Card";
import ApplianceDetails from "../components/ApplianceDetails";


function Appliances() {
    const [appliances, setAppliances] = useState(appliancesData);
    const [showForm, setShowForm] = useState(false);
    const [selectedAppliance, setSelectedAppliance] = useState<any>(null);
    const handleAddAppliance = (appliance: typeof appliancesData[number]) => {
        setAppliances((currentAppliances) => [
          ...currentAppliances,
          {
            ...appliance,
            id: Date.now(),
          },
        ]);
    
        setShowForm(false);
      };
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Home inventory</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Appliances
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep important information about your appliances organized.
            </p>
          </div>
  
          <Button onClick={() => setShowForm(true)}>
            + Add Appliance
          </Button>
        </div>
  
        {/* Search and Filter */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search appliances..."
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#5E7563]"
          />
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Rooms</option>
            <option>Kitchen</option>
            <option>Bedroom</option>
            <option>Living Room</option>
          </select>
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Categories</option>
            <option>Kitchen</option>
            <option>Cleaning</option>
            <option>Climate</option>
            <option>Entertainment</option>
          </select>
        </div>
  
        {/* Appliance Grid */}
        <section className="mt-6">
             <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {appliances.map((appliance) => (
                    <Card key={appliance.id} className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                        <p className="text-lg font-medium text-[#20211F]">
                            {appliance.name}
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                            {appliance.brand}
                        </p>
                        </div>

                        <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            appliance.warranty === "Active"
                            ? "bg-green-50 text-green-700"
                            : appliance.warranty === "Expiring Soon"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-stone-100 text-stone-600"
                        }`}
                        >
                        {appliance.warranty}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                        <div>
                        <p className="text-stone-400">Room</p>
                        <p className="mt-1 text-stone-700">
                            {appliance.room}
                        </p>
                        </div>

                        <div>
                        <p className="text-stone-400">Model</p>
                        <p className="mt-1 text-stone-700">
                            {appliance.model}
                        </p>
                        </div>

                        <div>
                        <p className="text-stone-400">Purchased</p>
                        <p className="mt-1 text-stone-700">
                            {appliance.purchaseDate}
                        </p>
                        </div>
                    </div>
                    <div>
                      <button
                        onClick={() => setSelectedAppliance(appliance)}
                        className="mt-5 text-sm font-medium text-[#5E7563] hover:underline"
                      >
                        View appliance →
                      </button>
                    </div>
                    </Card>
                ))}
            </div>
        </section>
        {showForm && (
            <AddApplianceForm
                onClose={() => setShowForm(false)}
                onSave={handleAddAppliance}
            />
         )}
        {selectedAppliance && (
          <ApplianceDetails
            appliance={selectedAppliance}
            onClose={() => setSelectedAppliance(null)}
          />
        )}
      </div>
    );
  }
  
  export default Appliances;