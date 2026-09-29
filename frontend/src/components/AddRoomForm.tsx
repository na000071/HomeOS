import { useState } from "react";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { roomTypes, type Room, type RoomType } from "../types/room";

export type RoomDraft = Omit<Room, "id">;

type AddRoomFormProps = {
  onClose: () => void;
  onSave: (room: RoomDraft) => void;
  initialRoom?: Room;
  title?: string;
  description?: string;
  submitLabel?: string;
};

type RoomFormValues = Omit<RoomDraft, "type"> & {
  type: RoomType | "";
};

const defaultFormValues: RoomFormValues = {
  name: "",
  description: "",
  type: "",
  icon: "room",
};

const getInitialFormValues = (room?: Room): RoomFormValues => room
  ? {
      name: room.name,
      description: room.description,
      type: room.type,
      icon: room.icon,
    }
  : defaultFormValues;

function AddRoomForm({
  onClose,
  onSave,
  initialRoom,
  title = "Add Room",
  description = "Add a room to organize your home.",
  submitLabel = "Save Room",
}: AddRoomFormProps) {
  const dialogRef = useModalAccessibility(onClose);
  const [formValues, setFormValues] = useState<RoomFormValues>(() => getInitialFormValues(initialRoom));
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormValues, string>>>({});
  const inputClass = "mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1";

  const updateField = <Field extends keyof RoomFormValues>(
    field: Field,
    value: RoomFormValues[Field],
  ) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof RoomFormValues, string>> = {};

    if (!formValues.name.trim()) nextErrors.name = "Room name is required.";
    if (!formValues.type) nextErrors.type = "Room type is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !formValues.type) return;

    onSave({
      ...formValues,
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      type: formValues.type,
      icon: formValues.icon.trim() || "room",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="add-room-title" aria-describedby="add-room-description" tabIndex={-1} className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home profile</p>
            <h2 id="add-room-title" className="mt-1 text-2xl font-semibold text-[#20211F]">{title}</h2>
            <p id="add-room-description" className="mt-2 text-sm text-stone-600">{description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close room form" className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">×</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="room-name" className="text-sm font-medium text-stone-700">Room name</label>
            <input id="room-name" value={formValues.name} onChange={(event) => updateField("name", event.target.value)} className={inputClass} placeholder="e.g. Guest Bedroom" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "room-name-error" : undefined} />
            {errors.name && <p id="room-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="room-type" className="text-sm font-medium text-stone-700">Room type</label>
            <select id="room-type" value={formValues.type} onChange={(event) => updateField("type", event.target.value as RoomType | "")} className={inputClass} aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? "room-type-error" : undefined}>
              <option value="">Select a room type</option>
              {roomTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
            {errors.type && <p id="room-type-error" role="alert" className="mt-1 text-xs text-red-600">{errors.type}</p>}
          </div>

          <div>
            <label htmlFor="room-description" className="text-sm font-medium text-stone-700">Description <span className="font-normal text-stone-400">(optional)</span></label>
            <textarea id="room-description" rows={3} value={formValues.description} onChange={(event) => updateField("description", event.target.value)} className={`${inputClass} resize-none`} placeholder="Add a short description of this room." />
          </div>

          <div>
            <label htmlFor="room-icon" className="text-sm font-medium text-stone-700">Icon <span className="font-normal text-stone-400">(optional)</span></label>
            <input id="room-icon" value={formValues.icon} onChange={(event) => updateField("icon", event.target.value)} className={inputClass} placeholder="e.g. bedroom" />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-lg px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">Cancel</button>
            <button type="submit" className="homeos-primary-button rounded-lg px-5 py-3 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomForm;