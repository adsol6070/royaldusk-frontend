import Swal from "sweetalert2";

export const confirmDialog = async ({
  title = "Are you sure?",
  text = "You won't be able to undo this!",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#ef4444", // red
    cancelButtonColor: "#6b7280", // gray
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};
