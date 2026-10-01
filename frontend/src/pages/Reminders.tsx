import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import AddReminderForm, { type ReminderDraft } from "../components/AddReminderForm";
import EditReminderForm from "../components/EditReminderForm";
import ReminderCard from "../components/ReminderCard";
import ReminderDetails from "../components/ReminderDetails";
import ReminderEmptyState from "../components/ReminderEmptyState";
import ReminderPriorityBadge from "../components/ReminderPriorityBadge";
import ReminderStatusBadge from "../components/ReminderStatusBadge";
import { appliancesData } from "../data/appliancesData";
import { useHomeData } from "../context/useHomeData";
import { formatMaintenanceDate } from "../services/maintenanceDateService";
import {
  reminderPriorities,
  reminderStatuses,
  reminderTypes,
  type Reminder,
  type ReminderPriority,
  type ReminderStatus,
  type ReminderType,
} from "../types/reminder";
import { filterReminders, type ReminderFilters } from "../utils/reminderFilters";
import { getReminderStatus } from "../utils/reminderStatus";
import { getReminderSummary } from "../utils/reminderSummary";
import { getNextReminderId } from "../utils/reminderIds";
import { sortReminders, type ReminderSortOption } from "../utils/reminderSorting";
import { getReminderSuggestions, isReminderDuplicate, type ReminderSuggestion } from "../utils/reminderSuggestions";
import type { SearchNavigationState } from "../types/search";

const defaultReminderFilters: ReminderFilters = {
  status: "all",
  type: "all",
  priority: "all",
  applianceId: "all",
};

function Reminders() {
  const location = useLocation();
  const { reminders, setReminders, maintenanceTasks, warranties } = useHomeData();
  const navigationState = location.state as SearchNavigationState | null;
  const selectedReminderId = navigationState?.reminderId;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(() =>
    selectedReminderId === undefined
      ? null
      : reminders.find((reminder) => reminder.id === selectedReminderId) ?? null,
  );
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [filters, setFilters] = useState<ReminderFilters>(defaultReminderFilters);
  const [sortOption, setSortOption] = useState<ReminderSortOption>("dueDateAsc");
  const [dismissedSuggestionKeys, setDismissedSuggestionKeys] = useState<Set<string>>(new Set());
  useEffect(() => {
    setSelectedReminder(
      selectedReminderId === undefined
        ? null
        : reminders.find((reminder) => reminder.id === selectedReminderId) ?? null,
    );
  }, [location.key, reminders, selectedReminderId]);
  const reminderSummary = getReminderSummary(reminders);
  const suggestions = getReminderSuggestions({
    maintenanceTasks,
    warranties,
    existingReminders: reminders,
  }).filter((suggestion) => !dismissedSuggestionKeys.has(suggestion.key));
  const visibleReminders = sortReminders(filterReminders(reminders, filters), sortOption);
  const hasActiveFilters = filters.status !== "all" || filters.type !== "all" || filters.priority !== "all" || filters.applianceId !== "all";
  const summaryCards = [
    { label: "Total Reminders", value: reminderSummary.total, description: "All tracked reminders" },
    { label: "Upcoming", value: reminderSummary.upcoming, description: "Next 30 days" },
    { label: "Due Soon", value: reminderSummary.dueSoon, description: "Within 7 days" },
    { label: "Overdue", value: reminderSummary.overdue, description: "Needs attention" },
    { label: "Completed", value: reminderSummary.completed, description: "Finished reminders" },
  ];

  const handleAcceptSuggestion = (suggestion: ReminderSuggestion) => {
    if (!isReminderDuplicate(suggestion.reminder, reminders)) {
      setReminders((currentReminders) => {
        return [...currentReminders, { ...suggestion.reminder, id: getNextReminderId(currentReminders) }];
      });
    }

    setDismissedSuggestionKeys((currentKeys) => new Set(currentKeys).add(suggestion.key));
  };

  const handleDismissSuggestion = (suggestionKey: string) => {
    setDismissedSuggestionKeys((currentKeys) => new Set(currentKeys).add(suggestionKey));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">Stay on top of things</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
            Reminders
          </h1>

          <p className="mt-2 text-stone-500">
            Keep track of important dates and upcoming home tasks.
          </p>
        </div>

        <button type="button" onClick={() => setIsFormOpen(true)} className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">
          + Add Reminder
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#20211F]">{card.value}</p>
            <p className="mt-1 text-sm text-stone-500">{card.description}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <label className="text-sm font-medium text-stone-700">
          Status
          <select aria-label="Filter reminders by status" value={filters.status} onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, status: event.target.value as ReminderStatus | "all" }))} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1">
            <option value="all">All statuses</option>
            {reminderStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium text-stone-700">
          Type
          <select aria-label="Filter reminders by type" value={filters.type} onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, type: event.target.value as ReminderType | "all" }))} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1">
            <option value="all">All types</option>
            {reminderTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium text-stone-700">
          Priority
          <select aria-label="Filter reminders by priority" value={filters.priority} onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, priority: event.target.value as ReminderPriority | "all" }))} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1">
            <option value="all">All priorities</option>
            {reminderPriorities.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </label>

        <label className="text-sm font-medium text-stone-700">
          Related appliance
          <select aria-label="Filter reminders by appliance" value={filters.applianceId} onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, applianceId: event.target.value === "all" ? "all" : Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1">
            <option value="all">All appliances</option>
            {appliancesData.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}
          </select>
        </label>

        <button type="button" onClick={() => setFilters(defaultReminderFilters)} disabled={!hasActiveFilters} className="self-end rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          Clear Filters
        </button>

        <label className="text-sm font-medium text-stone-700">
          Sort reminders
          <select aria-label="Sort reminders" value={sortOption} onChange={(event) => setSortOption(event.target.value as ReminderSortOption)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-normal text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1">
            <option value="dueDateAsc">Due Date: Earliest first</option>
            <option value="dueDateDesc">Due Date: Latest first</option>
            <option value="priorityDesc">Priority: High to Low</option>
            <option value="priorityAsc">Priority: Low to High</option>
            <option value="titleAsc">Title: A to Z</option>
            <option value="titleDesc">Title: Z to A</option>
          </select>
        </label>
      </div>

      <section className="mt-8" aria-labelledby="suggested-reminders-title">
          <div>
            <h2 id="suggested-reminders-title" className="text-xl font-semibold text-[#20211F]">Suggested Reminders</h2>
            <p className="mt-1 text-sm text-stone-500">Useful reminders found in your existing home records.</p>
          </div>

          {suggestions.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4">
              {suggestions.map((suggestion) => (
              <Card key={suggestion.key} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">{suggestion.source} suggestion</p>
                    <h3 className="mt-1 font-semibold text-[#20211F]">{suggestion.reminder.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{suggestion.reminder.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <ReminderStatusBadge status={suggestion.reminder.status} />
                      <ReminderPriorityBadge priority={suggestion.reminder.priority} />
                      <span className="text-sm text-stone-500">Due {formatMaintenanceDate(suggestion.reminder.dueDate, "long")}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                    <button type="button" onClick={() => handleAcceptSuggestion(suggestion)} className="homeos-primary-button rounded-lg px-4 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Add Reminder</button>
                    <button type="button" onClick={() => handleDismissSuggestion(suggestion.key)} className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">Ignore</button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <ReminderEmptyState title="No new suggestions" description="HomeOS does not have any new maintenance or warranty reminders to suggest right now." />
            </div>
          )}
      </section>

      {/* Reminder List */}
      <section className="mt-6">
        <div className="grid grid-cols-1 gap-4">
          {reminders.length === 0 ? (
            <ReminderEmptyState
              title="No reminders yet"
              description="Reminders help you track maintenance, warranties, bills, inspections, and documents in one place."
              actionLabel="Add Reminder"
              onAction={() => setIsFormOpen(true)}
            />
          ) : visibleReminders.length > 0 ? visibleReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onViewReminder={setSelectedReminder} />
          )) : (
            <ReminderEmptyState
              title="No reminders match these filters"
              description="Try clearing one or more filters to see more reminders."
              actionLabel="Clear Filters"
              onAction={() => setFilters(defaultReminderFilters)}
            />
          )}
        </div>
      </section>

      {isFormOpen && (
        <AddReminderForm
          onClose={() => setIsFormOpen(false)}
          onSave={(reminder: ReminderDraft) => {
            setReminders((currentReminders) => {
              return [
                ...currentReminders,
                {
                  ...reminder,
                  id: getNextReminderId(currentReminders),
                  status: getReminderStatus({ dueDate: reminder.dueDate, status: "Upcoming" }),
                },
              ];
            });
            setIsFormOpen(false);
          }}
        />
      )}

      {selectedReminder && (
        <ReminderDetails
          reminder={selectedReminder}
          onClose={() => setSelectedReminder(null)}
          onDelete={() => {
            setReminders((currentReminders) =>
              currentReminders.filter((currentReminder) => currentReminder.id !== selectedReminder.id),
            );
            setSelectedReminder(null);
          }}
          onMarkCompleted={() => {
            setReminders((currentReminders) =>
              currentReminders.map((currentReminder) =>
                currentReminder.id === selectedReminder.id
                  ? { ...currentReminder, status: "Completed" }
                  : currentReminder,
              ),
            );
            setSelectedReminder(null);
          }}
          onEdit={() => {
            setEditingReminder(selectedReminder);
            setSelectedReminder(null);
          }}
        />
      )}

      {editingReminder && (
        <EditReminderForm
          reminder={editingReminder}
          onClose={() => setEditingReminder(null)}
          onSave={(updatedReminder) => {
            const reminderWithUpdatedStatus: Reminder = {
              ...updatedReminder,
              status: getReminderStatus(updatedReminder),
            };

            setReminders((currentReminders) =>
              currentReminders.map((currentReminder) =>
                currentReminder.id === reminderWithUpdatedStatus.id
                  ? reminderWithUpdatedStatus
                  : currentReminder,
              ),
            );
            setEditingReminder(null);
          }}
        />
      )}

      {/* Smart Reminders */}
      <section className="mt-8 rounded-xl border border-stone-200 bg-[#E8E1D5] p-6">
        <p className="text-sm font-medium text-[#5E7563]">
          Future feature
        </p>

        <h2 className="mt-2 text-xl font-semibold text-[#20211F]">
          Smart reminders
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          HomeOS can suggest useful reminders based on existing maintenance tasks and warranty dates. Future versions will expand smart reminders to documents, recurring expenses, and other home activity.
        </p>
      </section>
    </div>
  );
}

export default Reminders;
