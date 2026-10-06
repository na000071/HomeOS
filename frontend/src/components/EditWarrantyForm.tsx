import type { Warranty } from "../types/warranty.ts";
import type { Appliance } from "../utils/applianceUtils";
import AddWarrantyForm, { type WarrantyDraft } from "./AddWarrantyForm";

type EditWarrantyFormProps = {
  warranty: Warranty;
  onClose: () => void;
  onSave: (warranty: Warranty) => void;
  applianceOptions?: Appliance[];
};

function EditWarrantyForm({ warranty, onClose, onSave, applianceOptions = [] }: EditWarrantyFormProps) {
  const initialValues: WarrantyDraft = {
    applianceId: warranty.applianceId,
    provider: warranty.provider,
    warrantyType: warranty.warrantyType,
    startDate: warranty.startDate,
    endDate: warranty.endDate,
    coverage: warranty.coverage,
    notes: warranty.notes,
  };

  return (
    <AddWarrantyForm
      onClose={onClose}
      onSave={(updatedDraft) => {
        if (updatedDraft.applianceId === null) {
          return;
        }

        onSave({ ...warranty, ...updatedDraft, applianceId: updatedDraft.applianceId });
      }}
      initialValues={initialValues}
      title="Edit Warranty"
      description="Update the warranty coverage details."
      submitLabel="Save Changes"
      applianceOptions={applianceOptions}
    />
  );
}

export default EditWarrantyForm;