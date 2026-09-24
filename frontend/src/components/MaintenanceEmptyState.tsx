type MaintenanceEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function MaintenanceEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: MaintenanceEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E7EEE8] text-[#5E7563]">
        <span className="text-xl" aria-hidden="true">+</span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-[#5E7563] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default MaintenanceEmptyState;