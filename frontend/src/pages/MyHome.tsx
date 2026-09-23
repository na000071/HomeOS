function MyHome() {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Home profile</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              My Home
            </h1>
  
            <p className="mt-2 text-stone-500">
              Manage your home information and rooms.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Room
          </button>
        </div>
  
        {/* Home Information */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#20211F]">
            Home Information
          </h2>
  
          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-stone-500">Home Name</p>
  
                <p className="mt-2 font-medium text-[#20211F]">
                  My Home
                </p>
              </div>
  
              <div>
                <p className="text-sm text-stone-500">Home Type</p>
  
                <p className="mt-2 font-medium text-[#20211F]">
                  Apartment
                </p>
              </div>
  
              <div>
                <p className="text-sm text-stone-500">Address</p>
  
                <p className="mt-2 font-medium text-[#20211F]">
                  Not added yet
                </p>
              </div>
  
              <div>
                <p className="text-sm text-stone-500">Year Added</p>
  
                <p className="mt-2 font-medium text-[#20211F]">
                  2026
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Rooms */}
        <section className="mt-8">
          <div>
            <h2 className="text-xl font-semibold text-[#20211F]">
              Rooms
            </h2>
  
            <p className="mt-1 text-sm text-stone-500">
              Organize appliances and maintenance by room.
            </p>
          </div>
  
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Kitchen */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[#20211F]">
                    Kitchen
                  </h3>
  
                  <p className="mt-1 text-sm text-stone-500">
                    4 appliances
                  </p>
                </div>
  
                <span className="text-2xl">⌂</span>
              </div>
  
              <button className="mt-6 text-sm font-medium text-[#5E7563] hover:underline">
                View room →
              </button>
            </div>
  
            {/* Bedroom */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[#20211F]">
                    Bedroom
                  </h3>
  
                  <p className="mt-1 text-sm text-stone-500">
                    1 appliance
                  </p>
                </div>
  
                <span className="text-2xl">⌂</span>
              </div>
  
              <button className="mt-6 text-sm font-medium text-[#5E7563] hover:underline">
                View room →
              </button>
            </div>
  
            {/* Living Room */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[#20211F]">
                    Living Room
                  </h3>
  
                  <p className="mt-1 text-sm text-stone-500">
                    2 appliances
                  </p>
                </div>
  
                <span className="text-2xl">⌂</span>
              </div>
  
              <button className="mt-6 text-sm font-medium text-[#5E7563] hover:underline">
                View room →
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  export default MyHome;