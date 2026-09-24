import { useState } from "react";
import { appliancesData } from "../data/appliancesData";
import { useModalAccessibility } from "../hooks/useModalAccessibility";

export type WarrantyDraft = {
  applianceId: number | null;
  provider: string;
  warrantyType: string;
  startDate: string;
  endDate: string;
  coverage: string;
  notes: string;
};

type AddWarrantyFormProps = {
  onClose: () => void;
  onSave: (warranty: WarrantyDraft) => void;
  initialValues?: Partial<WarrantyDraft>;
  title?: string;
  description?: string;
  submitLabel?: string;
};

const defaultFormValues: WarrantyDraft = {
  applianceId: null,
  provider: "",
  warrantyType: "",
  startDate: "",
  endDate: "",
  coverage: "",
  notes: "",
};

function AddWarrantyForm({
  onClose,
  onSave,
  initialValues,
  title = "Add Warranty",
  description = "Add coverage details for an appliance in your home.",
  submitLabel = "Save Warranty",
}: AddWarrantyFormProps) {
  const dialogRef = useModalAccessibility(onClose);
  const [formValues, setFormValues] = useState<WarrantyDraft>({
    ...defaultFormValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WarrantyDraft, string>>>({});

  const handleFieldChange = (field: keyof WarrantyDraft, value: string | number | null) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof WarrantyDraft, string>> = {};

    if (formValues.applianceId === null) nextErrors.applianceId = "Appliance is required.";
    if (!formValues.provider.trim()) nextErrors.provider = "Provider is required.";
    if (!formValues.warrantyType.trim()) nextErrors.warrantyType = "Warranty type is required.";
    if (!formValues.startDate) nextErrors.startDate = "Start date is required.";
    if (!formValues.endDate) nextErrors.endDate = "End date is required.";
    if (formValues.startDate && formValues.endDate && formValues.endDate < formValues.startDate) {
      nextErrors.endDate = "End date must be on or after the start date.";
    }
    if (!formValues.coverage.trim()) nextErrors.coverage = "Coverage is required.";

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      ...formValues,
      provider: formValues.provider.trim(),
      warrantyType: formValues.warrantyType.trim(),
      coverage: formValues.coverage.trim(),
      notes: formValues.notes.trim(),
    });
  };

  const inputClass = "mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="warranty-form-title"
        aria-describedby="warranty-form-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Protection & coverage</p>
            <h2 id="warranty-form-title" className="mt-1 text-2xl font-semibold text-sky-950">
              {title}
            </h2>
            <p id="warranty-form-description" className="mt-2 text-sm text-stone-600">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close warranty form"
            className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="warranty-appliance" className="text-sm font-medium text-stone-700">
                Related appliance
              </label>
              <select
                id="warranty-appliance"
                value={formValues.applianceId ?? ""}
                onChange={(event) => handleFieldChange("applianceId", event.target.value ? Number(event.target.value) : null)}
                className={inputClass}
                aria-invalid={Boolean(errors.applianceId)}
                aria-describedby={errors.applianceId ? "warranty-appliance-error" : undefined}
              >
                <option value="">Select an appliance</option>
                {appliancesData.map((appliance) => (
                  <option key={appliance.id} value={appliance.id}>
                    {appliance.name} · {appliance.brand}
                  </option>
                ))}
              </select>
              {errors.applianceId && <p id="warranty-appliance-error" role="alert" className="mt-1 text-xs text-red-600">{errors.applianceId}</p>}
            </div>

            <div>
              <label htmlFor="warranty-provider" className="text-sm font-medium text-stone-700">Provider</label>
              <input id="warranty-provider" value={formValues.provider} onChange={(event) => handleFieldChange("provider", event.target.value)} className={inputClass} placeholder="e.g. Samsung" aria-invalid={Boolean(errors.provider)} aria-describedby={errors.provider ? "warranty-provider-error" : undefined} />
              {errors.provider && <p id="warranty-provider-error" role="alert" className="mt-1 text-xs text-red-600">{errors.provider}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="warranty-type" className="text-sm font-medium text-stone-700">Warranty type</label>
              <input id="warranty-type" value={formValues.warrantyType} onChange={(event) => handleFieldChange("warrantyType", event.target.value)} className={inputClass} placeholder="e.g. Manufacturer warranty" aria-invalid={Boolean(errors.warrantyType)} aria-describedby={errors.warrantyType ? "warranty-type-error" : undefined} />
              {errors.warrantyType && <p id="warranty-type-error" role="alert" className="mt-1 text-xs text-red-600">{errors.warrantyType}</p>}
            </div>

            <div>
              <label htmlFor="warranty-start-date" className="text-sm font-medium text-stone-700">Start date</label>
              <input id="warranty-start-date" type="date" value={formValues.startDate} onChange={(event) => handleFieldChange("startDate", event.target.value)} className={inputClass} aria-invalid={Boolean(errors.startDate)} aria-describedby={errors.startDate ? "warranty-start-date-error" : undefined} />
              {errors.startDate && <p id="warranty-start-date-error" role="alert" className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="warranty-end-date" className="text-sm font-medium text-stone-700">End date</label>
              <input id="warranty-end-date" type="date" value={formValues.endDate} onChange={(event) => handleFieldChange("endDate", event.target.value)} className={inputClass} aria-invalid={Boolean(errors.endDate)} aria-describedby={errors.endDate ? "warranty-end-date-error" : undefined} />
              {errors.endDate && <p id="warranty-end-date-error" role="alert" className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="warranty-coverage" className="text-sm font-medium text-stone-700">Coverage</label>
              <textarea id="warranty-coverage" rows={3} value={formValues.coverage} onChange={(event) => handleFieldChange("coverage", event.target.value)} className={`${inputClass} resize-none`} placeholder="Describe what the warranty covers." aria-invalid={Boolean(errors.coverage)} aria-describedby={errors.coverage ? "warranty-coverage-error" : undefined} />
              {errors.coverage && <p id="warranty-coverage-error" role="alert" className="mt-1 text-xs text-red-600">{errors.coverage}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="warranty-notes" className="text-sm font-medium text-stone-700">Notes</label>
              <textarea id="warranty-notes" rows={3} value={formValues.notes} onChange={(event) => handleFieldChange("notes", event.target.value)} className={`${inputClass} resize-none`} placeholder="Add receipt, registration, or support notes." />
            </div>
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

export default AddWarrantyForm;