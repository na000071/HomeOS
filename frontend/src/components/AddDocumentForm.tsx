import { useState } from "react";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import {
  documentCategories,
  documentFileTypes,
  type Document,
  type DocumentCategory,
  type DocumentFileType,
} from "../types/document";
import type { Appliance } from "../utils/applianceUtils";
import type { Expense } from "../types/expense";

export type DocumentDraft = Omit<Document, "id">;

type DocumentFormValues = Omit<DocumentDraft, "category" | "fileType"> & {
  category: DocumentCategory | "";
  fileType: DocumentFileType | "";
};

type AddDocumentFormProps = {
  onClose: () => void;
  onSave: (document: DocumentDraft, file?: File) => void;
  initialDocument?: Document;
  title?: string;
  description?: string;
  submitLabel?: string;
  applianceOptions?: Appliance[];
  expenseOptions?: Expense[];
};

const defaultFormValues: DocumentFormValues = {
  name: "",
  category: "",
  fileType: "",
  fileName: "",
  dateAdded: "",
  description: "",
  applianceId: undefined,
  expenseId: undefined,
  notes: "",
};

const getInitialFormValues = (document?: Document): DocumentFormValues => document
  ? {
      name: document.name,
      category: document.category,
      fileType: document.fileType,
      fileName: document.fileName,
      dateAdded: document.dateAdded,
      description: document.description,
      applianceId: document.applianceId,
      expenseId: document.expenseId,
      notes: document.notes,
    }
  : defaultFormValues;

function AddDocumentForm({
  onClose,
  onSave,
  initialDocument,
  title = "Add Document",
  description = "Add metadata for a home document.",
  submitLabel = "Save Document",
  applianceOptions = [],
  expenseOptions = [],
}: AddDocumentFormProps) {
  const dialogRef = useModalAccessibility(onClose);
  const [formValues, setFormValues] = useState<DocumentFormValues>(() => getInitialFormValues(initialDocument));
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormValues, string>>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputClass = "mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#1677B8] focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-1";

  const updateField = <Field extends keyof DocumentFormValues>(
    field: Field,
    value: DocumentFormValues[Field],
  ) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof DocumentFormValues, string>> = {};

    if (!formValues.name.trim()) nextErrors.name = "Document name is required.";
    if (!formValues.category) nextErrors.category = "Category is required.";
    if (!formValues.fileType) nextErrors.fileType = "File type is required.";
    if (!formValues.fileName.trim()) nextErrors.fileName = "File name is required.";
    if (!initialDocument && !selectedFile) setFileError("Select a file to upload.");
    if (initialDocument && !formValues.dateAdded) nextErrors.dateAdded = "Date added is required.";

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !formValues.category || !formValues.fileType || (!initialDocument && !selectedFile)) {
      return;
    }

    onSave({
      ...formValues,
      name: formValues.name.trim(),
      category: formValues.category,
      fileType: formValues.fileType,
      fileName: formValues.fileName.trim(),
      description: formValues.description.trim(),
      notes: formValues.notes.trim(),
    }, selectedFile ?? undefined);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileError(null);

    if (!file) return;

    const extension = file.name.split(".").pop()?.toUpperCase() ?? "";
    updateField("fileName", file.name);
    updateField("fileType", extension as DocumentFileType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-document-title"
        aria-describedby="add-document-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home records</p>
            <h2 id="add-document-title" className="mt-1 text-2xl font-semibold text-[#20211F]">
              {title}
            </h2>
            <p id="add-document-description" className="mt-2 text-sm text-stone-600">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close document form"
            className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="document-name" className="text-sm font-medium text-stone-700">Document name</label>
              <input
                id="document-name"
                value={formValues.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
                placeholder="e.g. Refrigerator Receipt"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "document-name-error" : undefined}
              />
              {errors.name && <p id="document-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="document-category" className="text-sm font-medium text-stone-700">Category</label>
              <select
                id="document-category"
                value={formValues.category}
                onChange={(event) => updateField("category", event.target.value as DocumentCategory | "")}
                className={inputClass}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? "document-category-error" : undefined}
              >
                <option value="">Select a category</option>
                {documentCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              {errors.category && <p id="document-category-error" role="alert" className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="document-file-type" className="text-sm font-medium text-stone-700">File type</label>
              <select
                id="document-file-type"
                value={formValues.fileType}
                onChange={(event) => updateField("fileType", event.target.value as DocumentFileType | "")}
                className={inputClass}
                aria-invalid={Boolean(errors.fileType)}
                aria-describedby={errors.fileType ? "document-file-type-error" : undefined}
              >
                <option value="">Select a file type</option>
                {documentFileTypes.map((fileType) => <option key={fileType} value={fileType}>{fileType}</option>)}
              </select>
              {errors.fileType && <p id="document-file-type-error" role="alert" className="mt-1 text-xs text-red-600">{errors.fileType}</p>}
            </div>

            <div>
              <label htmlFor="document-file-name" className="text-sm font-medium text-stone-700">File name</label>
              <input
                id="document-file-name"
                value={formValues.fileName}
                onChange={(event) => updateField("fileName", event.target.value)}
                readOnly={!initialDocument && selectedFile !== null}
                className={inputClass}
                placeholder="e.g. refrigerator-receipt.pdf"
                aria-invalid={Boolean(errors.fileName)}
                aria-describedby={errors.fileName ? "document-file-name-error" : undefined}
              />
              {errors.fileName && <p id="document-file-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.fileName}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="document-file" className="text-sm font-medium text-stone-700">Upload document</label>
              <input
                id="document-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="mt-2 block w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 file:mr-4 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-700"
                aria-describedby={fileError ? "document-file-error" : "document-file-help"}
              />
              {selectedFile ? (
                <p id="document-file-help" className="mt-2 text-sm text-stone-500">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              ) : (
                <p id="document-file-help" className="mt-2 text-sm text-stone-500">PDF, DOC, DOCX, JPG, JPEG, or PNG. Maximum 10 MB.</p>
              )}
              {fileError && <p id="document-file-error" role="alert" className="mt-1 text-xs text-red-600">{fileError}</p>}
            </div>

            <div>
              <label htmlFor="document-date-added" className="text-sm font-medium text-stone-700">Date added</label>
              <input
                id="document-date-added"
                type="date"
                value={formValues.dateAdded}
                onChange={(event) => updateField("dateAdded", event.target.value)}
                className={inputClass}
                aria-invalid={Boolean(errors.dateAdded)}
                aria-describedby={errors.dateAdded ? "document-date-added-error" : undefined}
              />
              {errors.dateAdded && <p id="document-date-added-error" role="alert" className="mt-1 text-xs text-red-600">{errors.dateAdded}</p>}
            </div>

            <div>
              <label htmlFor="document-appliance" className="text-sm font-medium text-stone-700">Related appliance <span className="font-normal text-stone-400">(optional)</span></label>
              <select
                id="document-appliance"
                value={formValues.applianceId ?? ""}
                onChange={(event) => updateField("applianceId", event.target.value ? Number(event.target.value) : undefined)}
                className={inputClass}
              >
                <option value="">No appliance</option>
                {applianceOptions.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="document-expense" className="text-sm font-medium text-stone-700">Related expense <span className="font-normal text-stone-400">(optional)</span></label>
              <select
                id="document-expense"
                value={formValues.expenseId ?? ""}
                onChange={(event) => updateField("expenseId", event.target.value ? Number(event.target.value) : undefined)}
                className={inputClass}
              >
                <option value="">No expense</option>
                {expenseOptions.map((expense) => <option key={expense.id} value={expense.id}>{expense.description} · {expense.date}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="document-description" className="text-sm font-medium text-stone-700">Description</label>
              <textarea
                id="document-description"
                rows={3}
                value={formValues.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Add a short description of this document."
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="document-notes" className="text-sm font-medium text-stone-700">Notes</label>
              <textarea
                id="document-notes"
                rows={3}
                value={formValues.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Add any notes about this document."
              />
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

export default AddDocumentForm;