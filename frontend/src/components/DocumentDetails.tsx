import { useModalAccessibility } from "../hooks/useModalAccessibility";
import type { Document } from "../types/document";
import { getDocumentAppliance, getDocumentExpense } from "../utils/documentRelations";
import { formatExpenseAmount } from "../utils/expenseFormatting";
import { getMissingDocumentFields } from "../utils/documentValidation";
import DocumentEmptyState from "./DocumentEmptyState";
import type { Appliance } from "../utils/applianceUtils";
import type { Expense } from "../types/expense";

type DocumentDetailsProps = {
  document: Document;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  appliances?: Appliance[];
  expenses?: Expense[];
};

function DocumentDetails({ document, onClose, onEdit, onDelete, appliances, expenses }: DocumentDetailsProps) {
  const dialogRef = useModalAccessibility(onClose);
  const appliance = getDocumentAppliance(document, appliances);
  const expense = getDocumentExpense(document, expenses);
  const missingFields = getMissingDocumentFields(document);
  const hasUnavailableAppliance = document.applianceId !== undefined && !appliance;
  const hasUnavailableExpense = document.expenseId !== undefined && !expense;
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${document.name}"? This action cannot be undone.`,
    );

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-details-title"
        aria-describedby="document-details-description"
        tabIndex={-1}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home records</p>
            <h2 id="document-details-title" className="mt-1 text-2xl font-semibold text-sky-950">
              Document details
            </h2>
            <p id="document-details-description" className="mt-2 text-sm text-stone-600">
              Full information for {document.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close document details"
            className="shrink-0 rounded-lg p-1 text-2xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        {missingFields.length > 0 && (
          <div className="mt-6">
            <DocumentEmptyState
              compact
              title="Document information incomplete"
              description={`Missing information: ${missingFields.join(", ")}.`}
            />
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Document name</p>
            <p className="mt-1 text-lg font-semibold text-stone-900">{document.name}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Category</p>
            <p className="mt-1 text-stone-800">{document.category}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">File type</p>
            <p className="mt-1 text-stone-800">{document.fileType}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">File name</p>
            <p className="mt-1 break-words text-stone-800">{document.fileName}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Date added</p>
            <p className="mt-1 text-stone-800">{document.dateAdded}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500">Related appliance</p>
            {appliance ? (
              <p className="mt-1 text-stone-800">{appliance.name} · {appliance.brand}</p>
            ) : hasUnavailableAppliance ? (
              <DocumentEmptyState
                compact
                title="Appliance unavailable"
                description="This document references an appliance that could not be found."
              />
            ) : (
              <DocumentEmptyState compact title="No appliance linked" description="This document is not associated with an appliance." />
            )}
          </div>
          <div>
            <p className="text-sm text-stone-500">Related expense</p>
            {expense ? (
              <p className="mt-1 text-stone-800">
                {expense.description} · {formatExpenseAmount(expense.amount)}
              </p>
            ) : hasUnavailableExpense ? (
              <DocumentEmptyState
                compact
                title="Expense unavailable"
                description="This document references an expense that could not be found."
              />
            ) : (
              <DocumentEmptyState compact title="No expense linked" description="This document is not associated with an expense." />
            )}
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Description</p>
            <p className="mt-1 leading-6 text-stone-800">{document.description || "No description"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-stone-500">Notes</p>
            <p className="mt-1 leading-6 text-stone-800">{document.notes || "No notes"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-[#1677B8] bg-white px-5 py-3 text-sm font-medium text-[#1677B8] transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            Edit Document
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Delete Document
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetails;