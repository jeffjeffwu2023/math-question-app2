// src/utils/toast.js
import { toast } from "react-toastify";

export const showToast = (message, type = "info") => {
  const options = {
    className:
      "bg-white border-l-4 border-indigo-500 text-gray-800 text-body-md font-medium",
    bodyClassName: "p-4",
    progressClassName: "bg-indigo-500",
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    case "info":
    default:
      toast.info(message, options);
      break;
  }
};
