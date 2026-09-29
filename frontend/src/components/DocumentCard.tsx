import type { Document } from "../types/document";
import { getDocumentAppliance } from "../utils/documentRelations";
import { getMissingDocumentFields } from "../utils/documentValidation";
import Card from "./Card";
import DocumentEmptyState from "./DocumentEmptyState";

type DocumentCardProps = {
  document: Document;
  onViewDocument: (document: Document) => void;
};

function DocumentCard({ document, onViewDocument }: DocumentCardProps) {
  const appliance = getDocumentAppliance(document);
  const hasMissingInformation = getMissingDocumentFields(document).length > 0;
  const hasUnavailableAppliance = document.applianceId !== undefined && !appliance;

  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-semibold text-stone-600">
            {document.fileType}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-[#20211F]">
              {document.name || "Unnamed document"}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
              <span>{document.category}</span>
              <span>{document.fileType}</span>
              <span>Added {document.dateAdded}</span>
            </div>

            {appliance && (
              <p className="mt-2 text-sm text-stone-600">
                Appliance: {appliance.name} · {appliance.brand}
              </p>
            )}
            {!appliance && !hasUnavailableAppliance && (
              <p className="mt-2 text-sm text-stone-500">No appliance linked</p>
            )}
            {hasUnavailableAppliance && (
              <p className="mt-2 text-sm text-amber-700">Appliance unavailable</p>
            )}
            {hasMissingInformation && (
              <div className="mt-3">
                <DocumentEmptyState
                  compact
                  title="Document information incomplete"
                  description="Some document details are missing. Review this record before relying on it."
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewDocument(document)}
          aria-label={`View document: ${document.name}`}
          className="shrink-0 rounded-md text-left text-sm font-medium text-[#5E7563] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 sm:text-right"
        >
          View Document →
        </button>
      </div>
    </Card>
  );
}

export default DocumentCard;