import AddDocumentForm, { type DocumentDraft } from "./AddDocumentForm";
import type { Document } from "../types/document";
import type { Appliance } from "../utils/applianceUtils";
import type { Expense } from "../types/expense";

type EditDocumentFormProps = {
  document: Document;
  onClose: () => void;
  onSave: (document: Document) => void;
  applianceOptions?: Appliance[];
  expenseOptions?: Expense[];
};

function EditDocumentForm({ document, onClose, onSave, applianceOptions, expenseOptions }: EditDocumentFormProps) {
  const handleSave = (draft: DocumentDraft) => {
    onSave({ ...draft, id: document.id });
  };

  return (
    <AddDocumentForm
      initialDocument={document}
      onClose={onClose}
      onSave={handleSave}
      title="Edit Document"
      description="Update the metadata for this home document."
      submitLabel="Save Changes"
      applianceOptions={applianceOptions}
      expenseOptions={expenseOptions}
    />
  );
}

export default EditDocumentForm;