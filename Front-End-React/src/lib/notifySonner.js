import { toast } from "sonner";

export const notifySonner = (message, type = "success") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;

    case "error":
      toast.error(message);
      break;

    case "warning":
      toast.warning(message);
      break;

    case "info":
      toast.info(message);
      break;

    case "loading":
      return toast.loading(message);

    default:
      toast(message);
  }
};

export const notifySonnerPromise = (
  promise,
  messages = {
    loading: "",
    success: "",
    error: "",
  },
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

export { toast as sonnerToast };
