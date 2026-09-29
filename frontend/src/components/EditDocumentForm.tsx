import AddDocumentForm, { type DocumentDraft } from "./AddDocumentForm";
import type { Document } from "../types/document";

type EditDocumentFormProps = {
  document: Document;
  onClose: () => void;
  onSave: (document: Document) => void;
};

function EditDocumentForm({ document, onClose, onSave }: EditDocumentFormProps) {
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
    />
  );
}

export default EditDocumentForm;