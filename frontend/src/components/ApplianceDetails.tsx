type ApplianceDetailsProps = {
    appliance: any;
    onClose: () => void;
  };
  
  function ApplianceDetails({
    appliance,
    onClose,
  }: ApplianceDetailsProps) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-stone-400">
                {appliance.category}
              </p>
  
              <h2 className="mt-1 text-2xl font-semibold text-[#20211F]">
                {appliance.name}
              </h2>
  
              <p className="mt-1 text-stone-500">
                {appliance.brand}
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="text-2xl text-stone-400 hover:text-stone-700"
            >
              ×
            </button>
          </div>
  
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-stone-400">Model</p>
              <p className="mt-1 text-stone-700">
                {appliance.model}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Serial Number</p>
              <p className="mt-1 text-stone-700">
                {appliance.serialNumber}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Room</p>
              <p className="mt-1 text-stone-700">
                {appliance.room}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Purchase Date</p>
              <p className="mt-1 text-stone-700">
                {appliance.purchaseDate}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Purchase Price</p>
              <p className="mt-1 text-stone-700">
                ${appliance.purchasePrice}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-stone-400">Warranty</p>
              <p className="mt-1 text-stone-700">
                {appliance.warranty}
              </p>
            </div>
          </div>
  
          <div className="mt-6 border-t border-stone-100 pt-6">
            <p className="text-sm text-stone-400">Notes</p>
            <p className="mt-1 text-stone-700">
              {appliance.notes || "No notes"}
            </p>
          </div>
  
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white hover:bg-[#4F6655]"
            >
              Close
            </button>
          </div>
  
        </div>
      </div>
    );
  }
  
  export default ApplianceDetails;