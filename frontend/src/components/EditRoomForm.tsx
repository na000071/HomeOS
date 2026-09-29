import AddRoomForm, { type RoomDraft } from "./AddRoomForm";
import type { Room } from "../types/room";

type EditRoomFormProps = {
  room: Room;
  onClose: () => void;
  onSave: (room: Room) => void;
};

function EditRoomForm({ room, onClose, onSave }: EditRoomFormProps) {
  return (
    <AddRoomForm
      initialRoom={room}
      onClose={onClose}
      onSave={(draft: RoomDraft) => onSave({ ...draft, id: room.id })}
      title="Edit Room"
      description="Update the details for this room."
      submitLabel="Save Changes"
    />
  );
}

export default EditRoomForm;