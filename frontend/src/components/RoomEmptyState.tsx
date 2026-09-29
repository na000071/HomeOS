import Button from "./Button";

type RoomEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function RoomEmptyState({ title, description, actionLabel, onAction }: RoomEmptyStateProps) {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center sm:col-span-2 lg:col-span-3">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
        <span className="text-xl" aria-hidden="true">+</span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export default RoomEmptyState;