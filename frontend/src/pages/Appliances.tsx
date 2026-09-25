import { useState } from "react";
import AddApplianceForm from "../components/AddApplianceForm";
import Button from "../components/Button";
import Card from "../components/Card";
import ApplianceDetails from "../components/ApplianceDetails";
import EditApplianceForm from "../components/EditApplianceForm";
import { useNavigate } from "react-router-dom";
import {
  filterAppliances,
  type Appliance,
  type ApplianceFormValues,
} from "../utils/applianceUtils";
import { useHomeData } from "../context/useHomeData";


function Appliances() {
  const navigate = useNavigate();
    const { appliances, setAppliances } = useHomeData();
    const [showForm, setShowForm] = useState(false);
    const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null);
    const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
    const [filters, setFilters] = useState({
      searchQuery: "",
      room: "all",
      category: "all",
    });

    const handleAddAppliance = (appliance: ApplianceFormValues) => {
        setAppliances((currentAppliances) => [
          ...currentAppliances,
          {
            ...appliance,
            id: Date.now(),
          },
        ]);
    
        setShowForm(false);
      };

    const handleDeleteAppliance = (applianceId: number) => {
      setAppliances((currentAppliances) =>
        currentAppliances.filter((currentAppliance) => currentAppliance.id !== applianceId)
      );

      setSelectedAppliance(null);
    };

    const filteredAppliances = filterAppliances(appliances, filters);
    const roomOptions = Array.from(new Set(appliances.map((appliance) => appliance.room))).sort();
    const categoryOptions = Array.from(
      new Set(appliances.map((appliance) => appliance.category)),
    ).sort();

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
            value={filters.searchQuery}
            onChange={(event) =>
              setFilters((currentFilters) => ({
                ...currentFilters,
                searchQuery: event.target.value,
              }))
            }
            aria-label="Search appliances"
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#5E7563]"
          />
  
          <select
            value={filters.room}
            onChange={(event) =>
              setFilters((currentFilters) => ({
                ...currentFilters,
                room: event.target.value,
              }))
            }
            aria-label="Filter appliances by room"
            className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]"
          >
            <option value="all">All Rooms</option>
            {roomOptions.map((room) => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
  
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters((currentFilters) => ({
                ...currentFilters,
                category: event.target.value,
              }))
            }
            aria-label="Filter appliances by category"
            className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
  
        {/* Appliance Grid */}
        <section className="mt-6">
             <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredAppliances.map((appliance) => (
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
            {filteredAppliances.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-stone-300 p-8 text-center">
                <p className="font-medium text-stone-700">No appliances found</p>
                <p className="mt-1 text-sm text-stone-500">
                  Try a different search term or clear one of the filters.
                </p>
              </div>
            )}
        </section>
        {showForm && (
            <AddApplianceForm
                onClose={() => setShowForm(false)}
                onSave={handleAddAppliance}
            />
         )}

        {editingAppliance && (
          <EditApplianceForm
            appliance={editingAppliance}
            onClose={() => setEditingAppliance(null)}
            onSave={(updatedAppliance) => {
              setAppliances((currentAppliances) =>
                currentAppliances.map((currentAppliance) =>
                  currentAppliance.id === editingAppliance.id
                    ? { ...currentAppliance, ...updatedAppliance }
                    : currentAppliance
                )
              );

              setEditingAppliance(null);
            }}
          />
        )}
        {selectedAppliance && (
          <ApplianceDetails
            appliance={selectedAppliance}
            onClose={() => setSelectedAppliance(null)}
            onEdit={() => {
              setEditingAppliance(selectedAppliance);
              setSelectedAppliance(null);
            }}
            onDelete={() => handleDeleteAppliance(selectedAppliance.id)}
            onAddMaintenance={() => {
              navigate("/maintenance", {
                state: {
                  applianceId: selectedAppliance.id,
                  room: selectedAppliance.room,
                },
              });
              setSelectedAppliance(null);
            }}
            onViewWarranty={(warrantyId) => {
              navigate("/warranties", { state: { warrantyId } });
              setSelectedAppliance(null);
            }}
            onAddWarranty={() => {
              navigate("/warranties", {
                state: { applianceId: selectedAppliance.id },
              });
              setSelectedAppliance(null);
            }}
          />
        )}
      </div>
    );
  }
  
  export default Appliances;