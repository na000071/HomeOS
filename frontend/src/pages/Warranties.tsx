import { useState } from "react";
import { useLocation } from "react-router-dom";
import AddWarrantyForm, { type WarrantyDraft } from "../components/AddWarrantyForm";
import Button from "../components/Button";
import WarrantyCard from "../components/WarrantyCard";
import WarrantyDetails from "../components/WarrantyDetails";
import WarrantyEmptyState from "../components/WarrantyEmptyState.tsx";
import WarrantySummaryCard from "../components/WarrantySummaryCard";
import EditWarrantyForm from "../components/EditWarrantyForm";
import { useHomeData } from "../context/useHomeData";
import {
  createWarranty,
  withCalculatedWarrantyStatus,
} from "../services/warrantyDateService";
import { getApplianceById } from "../utils/applianceUtils";
import type { Warranty } from "../types/warranty.ts";
import { warrantyStatuses } from "../types/warranty.ts";
import {
  filterAndSortWarranties,
  type WarrantyFilters,
  type WarrantySortOption,
} from "../utils/warrantyFilters.ts";

function Warranties() {
  const location = useLocation();
  const { warranties, setWarranties } = useHomeData();
  const warrantyNavigationState = location.state as {
    warrantyId?: number;
    applianceId?: number;
  } | null;
    const initialWarranty = warrantyNavigationState?.warrantyId
      ? warranties.find((warranty) => warranty.id === warrantyNavigationState.warrantyId)
      : undefined;
    const [isFormOpen, setIsFormOpen] = useState(Boolean(warrantyNavigationState?.applianceId));
    const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(
      initialWarranty ? withCalculatedWarrantyStatus(initialWarranty) : null,
    );
    const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
    const [filters, setFilters] = useState<WarrantyFilters>({
      searchQuery: "",
      status: "all",
      applianceId: "all",
      warrantyType: "all",
      provider: "all",
    });
    const [sortOption, setSortOption] = useState<WarrantySortOption>("expirationAsc");

    const handleSaveWarranty = (warrantyDraft: WarrantyDraft) => {
      const warranty = createWarranty({
        ...warrantyDraft,
        applianceId: warrantyDraft.applianceId as number,
      });

      setWarranties((currentWarranties) => [warranty, ...currentWarranties]);
      setIsFormOpen(false);
    };

    const handleUpdateWarranty = (updatedWarranty: Warranty) => {
      const warrantyWithUpdatedStatus = withCalculatedWarrantyStatus(updatedWarranty);

      setWarranties((currentWarranties) =>
        currentWarranties.map((currentWarranty) =>
          currentWarranty.id === warrantyWithUpdatedStatus.id
            ? warrantyWithUpdatedStatus
            : currentWarranty,
        ),
      );
      setEditingWarranty(null);
      setSelectedWarranty(null);
    };

    const handleDeleteWarranty = (warrantyId: number) => {
      setWarranties((currentWarranties) =>
        currentWarranties.filter((warranty) => warranty.id !== warrantyId),
      );
      setSelectedWarranty(null);
      setEditingWarranty((currentEditingWarranty) =>
        currentEditingWarranty?.id === warrantyId ? null : currentEditingWarranty,
      );
    };

    const currentWarranties = warranties.map((warranty) => withCalculatedWarrantyStatus(warranty));
    const visibleWarranties = filterAndSortWarranties(currentWarranties, filters, sortOption);
    const applianceOptions = Array.from(
      new Map(
        currentWarranties.map((warranty) => {
          const appliance = getApplianceById(warranty.applianceId);
          return [warranty.applianceId, appliance];
        }),
      ).values(),
    ).filter((appliance): appliance is NonNullable<typeof appliance> => Boolean(appliance));
    const warrantyTypeOptions = Array.from(new Set(currentWarranties.map((warranty) => warranty.warrantyType))).sort();
    const providerOptions = Array.from(new Set(currentWarranties.map((warranty) => warranty.provider))).sort();
    const resetFilters = () => {
      setFilters({
        searchQuery: "",
        status: "all",
        applianceId: "all",
        warrantyType: "all",
        provider: "all",
      });
      setSortOption("expirationAsc");
    };
    const totalCount = currentWarranties.length;
    const activeCount = currentWarranties.filter((warranty) => warranty.status === "Active").length;
    const expiringSoonCount = currentWarranties.filter(
      (warranty) => warranty.status === "Expiring Soon",
    ).length;
    const expiredCount = currentWarranties.filter((warranty) => warranty.status === "Expired").length;

    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
        {/* Page Header */}
          <header className="flex flex-col gap-5 rounded-2xl border border-white/70 bg-white/45 p-5 shadow-sm backdrop-blur-sm sm:p-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Protection & coverage</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-sky-950">Warranties</h1>
              <p className="mt-2 max-w-2xl text-sm text-stone-600">
                Keep track of appliance warranties and expiration dates.
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>+ Add Warranty</Button>
          </header>

          <section
            aria-label="Warranty summary"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <WarrantySummaryCard
              label="Total Warranties"
              value={totalCount}
              description="All tracked warranties"
              tone="default"
            />
            <WarrantySummaryCard
              label="Active"
              value={activeCount}
              description="Current coverage"
              tone="success"
            />
            <WarrantySummaryCard
              label="Expiring Soon"
              value={expiringSoonCount}
              description="Within 90 days"
              tone="warning"
            />
            <WarrantySummaryCard
              label="Expired"
              value={expiredCount}
              description="No longer active"
              tone="danger"
            />
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white/80 px-4 pb-5 pt-3 shadow-sm sm:px-5 sm:pb-5 sm:pt-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="relative -top-2">
                <h2 className="text-xl font-semibold text-sky-950">Warranty List</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Coverage details for the appliances in your home.
                </p>
              </div>

              <div
                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                role="group"
                aria-label="Warranty search, filters, and sorting"
              >
                <label className="sr-only" htmlFor="warranty-search">
                  Search warranties
                </label>
                <input
                  id="warranty-search"
                  type="search"
                  placeholder="Search warranties..."
                  value={filters.searchQuery}
                  onChange={(event) => setFilters((current) => ({ ...current, searchQuery: event.target.value }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1 sm:col-span-2 xl:col-span-1"
                />

                <label className="sr-only" htmlFor="warranty-status-filter">
                  Filter warranties by status
                </label>
                <select
                  id="warranty-status-filter"
                  value={filters.status}
                  onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1"
                >
                  <option value="all">All Statuses</option>
                  {warrantyStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>

                <label className="sr-only" htmlFor="warranty-appliance-filter">Filter warranties by appliance</label>
                <select id="warranty-appliance-filter" value={filters.applianceId} onChange={(event) => setFilters((current) => ({ ...current, applianceId: event.target.value === "all" ? "all" : Number(event.target.value) }))} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1">
                  <option value="all">All Appliances</option>
                  {applianceOptions.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}
                </select>

                <label className="sr-only" htmlFor="warranty-type-filter">Filter warranties by type</label>
                <select id="warranty-type-filter" value={filters.warrantyType} onChange={(event) => setFilters((current) => ({ ...current, warrantyType: event.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1">
                  <option value="all">All Types</option>
                  {warrantyTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>

                <label className="sr-only" htmlFor="warranty-provider-filter">Filter warranties by provider</label>
                <select id="warranty-provider-filter" value={filters.provider} onChange={(event) => setFilters((current) => ({ ...current, provider: event.target.value }))} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1">
                  <option value="all">All Providers</option>
                  {providerOptions.map((provider) => <option key={provider} value={provider}>{provider}</option>)}
                </select>

                <label className="sr-only" htmlFor="warranty-sort">Sort warranties</label>
                <select id="warranty-sort" value={sortOption} onChange={(event) => setSortOption(event.target.value as WarrantySortOption)} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1">
                  <option value="expirationAsc">Expiration: soonest first</option>
                  <option value="expirationDesc">Expiration: latest first</option>
                  <option value="provider">Provider: A-Z</option>
                  <option value="status">Status</option>
                </select>

                <button type="button" onClick={resetFilters} aria-label="Clear warranty filters and sorting" className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1">
                  Clear filters
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4" role="region" aria-label="Warranty results" aria-live="polite">
              <p className="sr-only">
                Showing {visibleWarranties.length} of {currentWarranties.length} warranties.
              </p>
                {currentWarranties.length === 0 ? (
                  <WarrantyEmptyState
                    title="No warranties yet"
                    description="Add your first warranty to keep appliance coverage and expiration dates organized."
                    actionLabel="Add Warranty"
                    onAction={() => setIsFormOpen(true)}
                  />
                ) : visibleWarranties.length === 0 ? (
                  <WarrantyEmptyState
                    title="No warranties match these filters"
                    description="Try adjusting your search or filters to see more warranty records."
                    actionLabel="Clear Filters"
                    onAction={resetFilters}
                  />
                ) : visibleWarranties.map((warranty) => (
                  <WarrantyCard
                    key={warranty.id}
                    warranty={warranty}
                    onViewWarranty={setSelectedWarranty}
                  />
              ))}
            </div>
          </section>

          {isFormOpen && (
            <AddWarrantyForm
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveWarranty}
              initialValues={{
                applianceId: warrantyNavigationState?.applianceId ?? null,
              }}
            />
          )}

          {selectedWarranty && !isFormOpen && (
            <WarrantyDetails
              warranty={selectedWarranty}
              onClose={() => setSelectedWarranty(null)}
              onEdit={() => {
                setEditingWarranty(selectedWarranty);
                setSelectedWarranty(null);
              }}
              onDelete={() => handleDeleteWarranty(selectedWarranty.id)}
            />
          )}

          {editingWarranty && (
            <EditWarrantyForm
              warranty={editingWarranty}
              onClose={() => setEditingWarranty(null)}
              onSave={handleUpdateWarranty}
            />
          )}
      </div>
    );
  }
  
  export default Warranties;