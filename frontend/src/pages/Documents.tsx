import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import AddDocumentForm, { type DocumentDraft } from "../components/AddDocumentForm";
import DocumentCard from "../components/DocumentCard";
import DocumentDetails from "../components/DocumentDetails";
import DocumentEmptyState from "../components/DocumentEmptyState";
import EditDocumentForm from "../components/EditDocumentForm";
import { useHomeData } from "../context/useHomeData";
import { getDocumentCategoryBreakdown, getDocumentSummary } from "../utils/documentSummary";
import {
  documentCategories,
  documentFileTypes,
  type Document,
  type DocumentCategory,
  type DocumentFileType,
} from "../types/document";
import { filterDocuments, type DocumentFilters } from "../utils/documentFilters";
import { sortDocuments, type DocumentSortOption } from "../utils/documentSorting";
import type { SearchNavigationState } from "../types/search";
import {
  downloadDocument,
  deleteDocument,
  uploadDocument,
  updateDocument as updateDocumentApi,
  type DocumentWriteData,
} from "../services/documentsApi";

const defaultDocumentFilters: DocumentFilters = {
  category: "all",
  fileType: "all",
  applianceId: "all",
};

function Documents() {
  const location = useLocation();
  const { documents, setDocuments, appliances, expenses, isDataLoading, dataLoadError } = useHomeData();
  const navigationState = location.state as SearchNavigationState | null;
  const selectedDocumentId = navigationState?.documentId;
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(() =>
    selectedDocumentId === undefined
      ? null
      : documents.find((document) => document.id === selectedDocumentId) ?? null,
  );
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [filters, setFilters] = useState<DocumentFilters>(defaultDocumentFilters);
  const [sortOption, setSortOption] = useState<DocumentSortOption>("newest");
  const [operationError, setOperationError] = useState<string | null>(null);
  useEffect(() => {
    setSelectedDocument(
      selectedDocumentId === undefined
        ? null
        : documents.find((document) => document.id === selectedDocumentId) ?? null,
    );
  }, [documents, location.key, selectedDocumentId]);

    const toApiDocument = (document: Document): DocumentWriteData => ({
      name: document.name,
      category: document.category,
      fileType: document.fileType,
      fileName: document.fileName,
      dateAdded: document.dateAdded || new Date().toISOString(),
      description: document.description || null,
      applianceId: document.applianceId === undefined ? null : appliances.find((item) => item.id === document.applianceId)?.apiId ?? null,
      expenseId: document.expenseId === undefined ? null : expenses.find((item) => item.id === document.expenseId)?.apiId ?? null,
      notes: document.notes || null,
    });

    const handleDownloadDocument = async (document: Document) => {
      const currentDocument = documents.find((item) => item.id === document.id);
      if (!currentDocument?.apiId || !document.hasFile) return;

      try {
        setOperationError(null);
        const blob = await downloadDocument(currentDocument.apiId);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch (error) {
        setOperationError(error instanceof Error ? error.message : "We couldn't open this document.");
      }
    };
    const documentSummary = getDocumentSummary(documents);
    const categoryBreakdown = getDocumentCategoryBreakdown(documents);
    const filteredDocuments = sortDocuments(filterDocuments(documents, filters), sortOption);
    const hasActiveFilters = filters.category !== "all" || filters.fileType !== "all" || filters.applianceId !== "all";
    const summaryCards = [
      { label: "Total Documents", value: documentSummary.total, description: "All home records" },
      { label: "Receipts", value: documentSummary.receipts, description: "Purchase records" },
      { label: "Manuals", value: documentSummary.manuals, description: "Appliance instructions" },
      { label: "Warranties", value: documentSummary.warranties, description: "Coverage records" },
      { label: "Other Documents", value: documentSummary.otherDocuments, description: "Additional home records" },
    ];

    return (
      <div>
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500">Home records</p>
  
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">
              Documents
            </h1>
  
            <p className="mt-2 text-stone-500">
              Keep your home documents organized in one place.
            </p>
          </div>
  
          <button
            type="button"
            onClick={() => setIsAddDocumentOpen(true)}
            className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
          >
            + Add Document
          </button>
        </div>

        {(dataLoadError || operationError) && (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {operationError ?? dataLoadError}
          </div>
        )}

        {isDataLoading && (
          <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 text-center text-stone-500">
            Loading documents...
          </div>
        )}
  
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

        {/* Category Breakdown */}
        <section className="mt-8">
          <div>
            <h2 className="text-xl font-semibold text-[#20211F]">Documents by Category</h2>
            <p className="mt-1 text-sm text-stone-500">A complete count of your home records by category.</p>
          </div>

          <Card className="mt-4 p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryBreakdown.map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
                  <span className="text-sm text-stone-600">{category}</span>
                  <span className="text-lg font-semibold text-[#20211F]">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
  
        {/* Filters */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="document-category-filter" className="text-sm font-medium text-stone-700">
              Category
            </label>
            <select
              id="document-category-filter"
              value={filters.category}
              onChange={(event) => setFilters((currentFilters) => ({
                ...currentFilters,
                category: event.target.value as DocumentCategory | "all",
              }))}
              className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
            >
              <option value="all">All categories</option>
              {documentCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="document-file-type-filter" className="text-sm font-medium text-stone-700">
              File type
            </label>
            <select
              id="document-file-type-filter"
              value={filters.fileType}
              onChange={(event) => setFilters((currentFilters) => ({
                ...currentFilters,
                fileType: event.target.value as DocumentFileType | "all",
              }))}
              className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
            >
              <option value="all">All file types</option>
              {documentFileTypes.map((fileType) => <option key={fileType} value={fileType}>{fileType}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="document-appliance-filter" className="text-sm font-medium text-stone-700">
              Related appliance
            </label>
            <select
              id="document-appliance-filter"
              value={filters.applianceId}
              onChange={(event) => setFilters((currentFilters) => ({
                ...currentFilters,
                applianceId: event.target.value === "all" ? "all" : Number(event.target.value),
              }))}
              className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
            >
              <option value="all">All appliances</option>
              {appliances.map((appliance) => <option key={appliance.id} value={appliance.id}>{appliance.name} · {appliance.brand}</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setFilters(defaultDocumentFilters)}
            disabled={!hasActiveFilters}
            className="self-end rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>

          <div>
            <label htmlFor="document-sort" className="text-sm font-medium text-stone-700">
              Sort documents
            </label>
            <select
              id="document-sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as DocumentSortOption)}
              className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 outline-none transition focus:border-[#5E7563] focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-1"
            >
              <option value="newest">Newest added</option>
              <option value="oldest">Oldest added</option>
              <option value="nameAsc">Name A-Z</option>
              <option value="nameDesc">Name Z-A</option>
              <option value="categoryAsc">Category A-Z</option>
            </select>
          </div>
        </div>
  
        {/* Documents */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.length > 0 ? filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} appliances={appliances} onViewDocument={setSelectedDocument} />
          )) : (
            documents.length === 0 ? (
              <DocumentEmptyState
                title="No documents yet"
                description="Keep receipts, warranties, manuals, and other home records together in one place."
                actionLabel="Add Document"
                onAction={() => setIsAddDocumentOpen(true)}
              />
            ) : (
              <DocumentEmptyState
                title="No documents match these filters"
                description="Try clearing one or more filters to see more documents."
                actionLabel="Clear Filters"
                onAction={() => setFilters(defaultDocumentFilters)}
              />
            )
          )}
          </div>
        </section>
  
        {/* Future AI Feature */}
        <section className="mt-8 rounded-xl border border-stone-200 bg-[#E8E1D5] p-6">
          <p className="text-sm font-medium text-[#5E7563]">
            Coming later
          </p>
  
          <h2 className="mt-2 text-xl font-semibold text-[#20211F]">
            Smart document extraction
          </h2>
  
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Upload a receipt or warranty document and HomeOS will eventually be
            able to extract useful information such as the appliance, brand,
            model, purchase date, price, and warranty period.
          </p>
        </section>

        {isAddDocumentOpen && (
          <AddDocumentForm
            onClose={() => setIsAddDocumentOpen(false)}
            applianceOptions={appliances}
            expenseOptions={expenses}
            onSave={async (document: DocumentDraft, file?: File) => {
              if (!file) return;

              try {
                setOperationError(null);
                const createdDocument = await uploadDocument({
                  name: document.name,
                  category: document.category,
                  description: document.description || null,
                  applianceId: document.applianceId === undefined ? null : appliances.find((item) => item.id === document.applianceId)?.apiId ?? null,
                  expenseId: document.expenseId === undefined ? null : expenses.find((item) => item.id === document.expenseId)?.apiId ?? null,
                  notes: document.notes || null,
                  file,
                });
                setDocuments((currentDocuments) => [...currentDocuments, {
                  ...document,
                  id: Date.now(),
                  apiId: createdDocument.id,
                  fileName: createdDocument.fileName,
                  fileType: createdDocument.fileType as Document["fileType"],
                  dateAdded: createdDocument.dateAdded,
                  contentType: createdDocument.contentType ?? undefined,
                  fileSize: createdDocument.fileSize ?? undefined,
                  hasFile: createdDocument.hasFile,
                }]);
                setIsAddDocumentOpen(false);
              } catch {
                setOperationError("We couldn't save this document. Please try again.");
              }
            }}
          />
        )}

        {editingDocument && (
          <EditDocumentForm
            document={editingDocument}
            onClose={() => setEditingDocument(null)}
            applianceOptions={appliances}
            expenseOptions={expenses}
            onSave={async (updatedDocument) => {
              const currentDocument = documents.find((document) => document.id === updatedDocument.id);
              if (!currentDocument?.apiId) return;

              try {
                setOperationError(null);
                await updateDocumentApi(currentDocument.apiId, toApiDocument(updatedDocument));
                setDocuments((currentDocuments) => currentDocuments.map((document) => document.id === updatedDocument.id ? { ...updatedDocument, apiId: currentDocument.apiId } : document));
                setEditingDocument(null);
              } catch {
                setOperationError("We couldn't update this document. Please try again.");
              }
            }}
          />
        )}

        {selectedDocument && (
          <DocumentDetails
            document={selectedDocument}
            appliances={appliances}
            expenses={expenses}
            onDownload={selectedDocument.hasFile ? () => handleDownloadDocument(selectedDocument) : undefined}
            onClose={() => setSelectedDocument(null)}
            onDelete={async () => {
              const currentDocument = documents.find((document) => document.id === selectedDocument.id);
              if (!currentDocument?.apiId) return;

              try {
                setOperationError(null);
                await deleteDocument(currentDocument.apiId);
                setDocuments((currentDocuments) => currentDocuments.filter((document) => document.id !== selectedDocument.id));
                setSelectedDocument(null);
              } catch {
                setOperationError("We couldn't delete this document. Please try again.");
              }
            }}
            onEdit={() => {
              setEditingDocument(selectedDocument);
              setSelectedDocument(null);
            }}
          />
        )}
      </div>
    );
  }
  
  export default Documents;