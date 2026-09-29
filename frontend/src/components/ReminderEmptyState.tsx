import Button from "./Button";

type ReminderEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function ReminderEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: ReminderEmptyStateProps) {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
        <span className="text-xl" aria-hidden="true">+</span>
      </div>
      <h2 className="mt-4 text-base font-semibold text-stone-800">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export default ReminderEmptyState;