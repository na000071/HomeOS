type ExpenseEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function ExpenseEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: ExpenseEmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center"
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
        <span className="text-xl" aria-hidden="true">+</span>
      </div>
      <h2 className="mt-4 text-base font-semibold text-stone-800">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="homeos-primary-button mt-5 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ExpenseEmptyState;