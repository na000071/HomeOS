import { useEffect, useState } from "react";
import type { Appliance, ApplianceFormValues } from "../utils/applianceUtils";

type AddApplianceFormProps = {
    onClose: () => void;
  onSave: (appliance: ApplianceFormValues) => void;
  initialAppliance?: Appliance;
  };
  
  function AddApplianceForm({ onClose, onSave, initialAppliance }: AddApplianceFormProps) {
    const isEditing = Boolean(initialAppliance);

    const [name, setName] = useState(initialAppliance?.name ?? "");
    const [brand, setBrand] = useState(initialAppliance?.brand ?? "");
    const [model, setModel] = useState(initialAppliance?.model ?? "");
    const [room, setRoom] = useState(initialAppliance?.room ?? "");
    const [purchaseDate, setPurchaseDate] = useState(initialAppliance?.purchaseDate ?? "");
    const [category, setCategory] = useState(initialAppliance?.category ?? "");
    const [serialNumber, setSerialNumber] = useState(initialAppliance?.serialNumber ?? "");
    const [purchasePrice, setPurchasePrice] = useState(initialAppliance?.purchasePrice ?? "");
    const [notes, setNotes] = useState(initialAppliance?.notes ?? "");

    useEffect(() => {
      if (!initialAppliance) {
        setName("");
        setBrand("");
        setModel("");
        setRoom("");
        setPurchaseDate("");
        setCategory("");
        setSerialNumber("");
        setPurchasePrice("");
        setNotes("");
        return;
      }

      setName(initialAppliance.name ?? "");
      setBrand(initialAppliance.brand ?? "");
      setModel(initialAppliance.model ?? "");
      setRoom(initialAppliance.room ?? "");
      setPurchaseDate(initialAppliance.purchaseDate ?? "");
      setCategory(initialAppliance.category ?? "");
      setSerialNumber(initialAppliance.serialNumber ?? "");
      setPurchasePrice(initialAppliance.purchasePrice ?? "");
      setNotes(initialAppliance.notes ?? "");
    }, [initialAppliance]);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-stone-500">
                Home inventory
              </p>
  
              <h2 className="mt-1 text-2xl font-semibold text-[#20211F]">
                {isEditing ? "Edit Appliance" : "Add Appliance"}
              </h2>
  
              <p className="mt-2 text-sm text-stone-500">
                {isEditing ? "Update appliance details." : "Add an appliance to your home inventory."}
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="text-xl text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              ×
            </button>
          </div>
  
          {/* Form */}
          <form className="mt-6 space-y-5"
                onSubmit={(event) => {
                    event.preventDefault();

                    onSave({
                      ...(initialAppliance ? { id: initialAppliance.id } : {}),
                      name,
                      brand,
                      room,
                      warranty: initialAppliance?.warranty ?? "No Warranty",
                      model,
                      purchaseDate,
                      category,
                      serialNumber,
                      purchasePrice,
                      notes,
                    });
                }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Appliance Name
                </label>
  
                <input
                  type="text"
                  placeholder="e.g. Refrigerator"
                  className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Brand
                </label>
  
                <input
                  type="text"
                  placeholder="e.g. Samsung"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                />
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Model
                </label>
  
                <input
                  type="text"
                  placeholder="e.g. RF28T5001"
                  value= {model}
                  onChange={(event) => setModel(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                />
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Serial Number
                </label>
  
                <input
                  type="text"
                  placeholder="Enter serial number"
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                />
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Category
                </label>
  
                <select 
                 
                 value={category}
                 onChange={(event) => setCategory(event.target.value)}
                 className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#5E7563]">
                  
                  <option value="">Select a category</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="laundry">Laundry</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="heating-cooling">Heating & Cooling</option>
                  <option value="other">Other</option>
                </select>
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Room
                </label>
  
                <select value={room}
                 onChange={(event) => setRoom(event.target.value)}
                 className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                >
                 <option value="">Select a room</option>

                  <option value="kitchen">Kitchen</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="living-room">Living Room</option>
                  <option value="laundry">Laundry</option>
                  <option value="whole-home">Whole Home</option>
                </select>
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Purchase Date
                </label>
  
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(event) => setPurchaseDate(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                />
              </div>
  
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Purchase Price
                </label>
  
                <input
                  type="number"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(event) => setPurchasePrice(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
                />
              </div>
            </div>
  
            <div>
              <label className="text-sm font-medium text-stone-700">
                Notes
              </label>
  
              <textarea
                rows={3}
                placeholder="Add any notes about this appliance..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-2 w-full resize-none rounded-lg border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#5E7563]"
              />
            </div>
  
            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-5 py-3 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
  
              <button
                type="submit"
                className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white hover:bg-[#4F6655]"
              >
                {isEditing ? "Save Changes" : "Save Appliance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default AddApplianceForm;