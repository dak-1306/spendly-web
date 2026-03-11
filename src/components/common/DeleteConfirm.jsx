import Button from "./Button";
import Modal from "./Modal";

export default function DeleteConfirm({
  open = false,
  onClose = () => {},
  title = "Xác nhận",
  description = "",
  confirmLabel = "Xác nhận",
  onConfirm = () => {},
}) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <div className="bg-red-500 p-4">
        <h3 className="text-lg text-white font-semibold text-center">
          {title}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {description && <p className=" text-md text-gray-700">{description}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
