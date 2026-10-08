import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { useHomeData } from "../context/useHomeData";
import { searchHomeData } from "../utils/globalSearch";
import type {
  SearchNavigationState,
  SearchResult,
  SearchResultFilter,
  SearchResultType,
} from "../types/search";

const typeLabels: Record<SearchResultType, string> = {
  appliance: "Appliance",
  maintenance: "Maintenance",
  warranty: "Warranty",
  expense: "Expense",
  document: "Document",
  reminder: "Reminder",
  room: "Room",
};

const filterOptions: ReadonlyArray<{ value: SearchResultFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "appliance", label: "Appliances" },
  { value: "maintenance", label: "Maintenance" },
  { value: "warranty", label: "Warranties" },
  { value: "expense", label: "Expenses" },
  { value: "document", label: "Documents" },
  { value: "reminder", label: "Reminders" },
  { value: "room", label: "Rooms" },
];

const getNavigationState = (result: SearchResult): SearchNavigationState => {
  switch (result.type) {
    case "appliance":
      return { applianceId: result.id };
    case "maintenance":
      return { maintenanceTaskId: result.id };
    case "warranty":
      return { warrantyId: result.id };
    case "expense":
      return { expenseId: result.id };
    case "document":
      return { documentId: result.id };
    case "reminder":
      return { reminderId: result.id };
    case "room":
      return { roomId: result.id };
  }
};

function GlobalSearch() {
  const {
    appliances,
    maintenanceTasks,
    warranties,
    expenses,
    documents,
    reminders,
    rooms,
  } = useHomeData();
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState<SearchResultFilter>("all");
  const hasMeaningfulQuery = query.trim().length >= 2;
  const results = useMemo(() => searchHomeData(query, {
    appliances,
    maintenanceTasks,
    warranties,
    expenses,
    documents,
    reminders,
    rooms,
  }), [appliances, maintenanceTasks, warranties, expenses, documents, reminders, rooms, query]);
  const filteredResults = resultFilter === "all"
    ? results
    : results.filter((result) => result.type === resultFilter);
  const selectedFilterLabel = filterOptions.find((option) => option.value === resultFilter)?.label ?? "All";

  return (
    <section aria-labelledby="global-search-title" className="mb-8">
      <div className="flex flex-col gap-1">
        <h2 id="global-search-title" className="text-xl font-semibold text-[#20211F]">
          Search your home
        </h2>
        <p className="text-sm text-stone-500">
          Find appliances, tasks, records, rooms, and more.
        </p>
      </div>

      <div className="relative mt-4">
        <label htmlFor="global-search-input" className="sr-only">Search all home records</label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-stone-400"
        >
          ⌕
        </span>
        <input
          id="global-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search all home records..."
          autoComplete="off"
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-24 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear global search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="global-search-filter" className="text-sm font-medium text-stone-700">
          Filter results
          <select
            id="global-search-filter"
            value={resultFilter}
            onChange={(event) => setResultFilter(event.target.value as SearchResultFilter)}
            className="mt-2 block w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm font-normal text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1 sm:mt-0 sm:ml-2 sm:inline-block sm:w-auto"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        {hasMeaningfulQuery && (
          <p className="text-sm text-stone-500" aria-live="polite">
            {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
            {resultFilter !== "all" ? ` in ${selectedFilterLabel}` : ""}
          </p>
        )}
      </div>

      <div className="mt-4" aria-live="polite">
        {!hasMeaningfulQuery ? (
          <Card className="border-dashed bg-stone-50 p-5 sm:p-6">
            <p className="font-medium text-stone-800">Find anything in your home records</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-500">
              Search appliances, warranties, maintenance, expenses, documents, reminders, and rooms by name or useful details.
            </p>
          </Card>
        ) : filteredResults.length === 0 ? (
          <Card className="border-dashed bg-stone-50 p-5 sm:p-6">
            <p className="font-medium text-stone-800">
              {results.length === 0
                ? "No matching records found"
                : `No ${selectedFilterLabel.toLowerCase()} results found`}
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-500">
              {results.length === 0
                ? <>No records match &ldquo;{query.trim()}&rdquo;. Check the spelling or try a broader search term.</>
                : <>No {selectedFilterLabel.toLowerCase()} records match &ldquo;{query.trim()}&rdquo;.</>}
            </p>
            {results.length > 0 && resultFilter !== "all" && (
              <button
                type="button"
                onClick={() => setResultFilter("all")}
                className="mt-4 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
              >
                Show all results
              </button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2" role="list" aria-label="Global search results">
            {filteredResults.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.route}
                state={getNavigationState(result)}
                className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
                role="listitem"
              >
                <Card className="h-full p-4 transition hover:border-[#1677B8] hover:shadow-sm sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                        {typeLabels[result.type]}
                      </p>
                      <h3 className="mt-1 truncate font-semibold text-[#20211F]">{result.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-5 text-stone-600">{result.description}</p>
                  {result.related && result.related.length > 0 && (
                    <p className="mt-2 truncate text-xs text-stone-400">
                      Related: {result.related.map((item) => item.title).join(", ")}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default GlobalSearch;