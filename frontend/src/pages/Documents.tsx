import Card from "../components/Card";
import { documentsData } from "../data/documentsData";

function Documents() {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Home records</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Documents
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep your home documents organized in one place.
            </p>
          </div>
  
          <button className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]">
            + Add Document
          </button>
        </div>
  
        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Total Documents</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">12</p>
            <p className="mt-1 text-sm text-stone-500">All home records</p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Receipts</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">4</p>
            <p className="mt-1 text-sm text-stone-500">Purchase records</p>
          </div>
  
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Warranty Documents</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">3</p>
            <p className="mt-1 text-sm text-stone-500">Coverage records</p>
          </div>
        </div>
  
        {/* Search and Filter */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search documents..."
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#5E7563]"
          />
  
          <select className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none focus:border-[#5E7563]">
            <option>All Types</option>
            <option>Receipt</option>
            <option>Warranty</option>
            <option>Manual</option>
            <option>Insurance</option>
            <option>Invoice</option>
            <option>Other</option>
          </select>
        </div>
  
        {/* Documents */}
        <section className="mt-6">
            <Card>
                {documentsData.map((document, index) => (
                <div
                    key={document.id}
                    className={`flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between ${
                    index !== documentsData.length - 1
                        ? "border-b border-stone-100"
                        : ""
                    }`}
                >
                    <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-sm font-medium text-stone-600">
                        {document.fileType}
                    </div>

                    <div>
                        <h2 className="font-medium text-[#20211F]">
                        {document.name}
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                        {document.type} · {document.relatedTo} · Added{" "}
                        {document.addedDate}
                        </p>
                    </div>
                    </div>

                    <button className="text-left text-sm font-medium text-[#5E7563] hover:underline md:text-right">
                    View Document →
                    </button>
                </div>
                ))}
            </Card>
        </section>
  
        {/* Future AI Feature */}
        <section className="mt-8 rounded-xl border border-stone-200 bg-[#E8E1D5] p-6">
          <p className="text-sm font-medium text-[#5E7563]">
            Coming later
          </p>
  
          <h2 className="mt-2 text-xl font-semibold text-[#20211F]">
            Smart document extraction
          </h2>
  
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Upload a receipt or warranty document and HomeOS will eventually be
            able to extract useful information such as the appliance, brand,
            model, purchase date, price, and warranty period.
          </p>
        </section>
      </div>
    );
  }
  
  export default Documents;