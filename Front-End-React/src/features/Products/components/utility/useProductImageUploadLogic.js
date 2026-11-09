import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const useProductImageUploadLogic = (hookProps0) => {
  const {
    initialImageUrl = "",
    onChange,
    onRemove,
    disabled = false,
  } = hookProps0;

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const ACCEPTED_IMAGE_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isExistingImageRemoved, setIsExistingImageRemoved] = useState(false);
  const previewObjectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  const revokePreviewUrl = useCallback(() => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setErrorMessage("");
      if (fileRejections.length > 0) {
        const errorCode = fileRejections[0].errors[0]?.code;
        if (errorCode === "file-too-large") {
          setErrorMessage("Image size must not exceed 5 MB.");
        } else if (errorCode === "file-invalid-type") {
          setErrorMessage("Only JPG, PNG, and WebP images are allowed.");
        } else if (errorCode === "too-many-files") {
          setErrorMessage("Please select only one image.");
        } else {
          setErrorMessage("Unable to select this image.");
        }
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      // Release the previous temporary preview URL.
      revokePreviewUrl();

      // Create a preview URL for the new file.
      const objectUrl = URL.createObjectURL(file);
      previewObjectUrlRef.current = objectUrl;
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
      setIsExistingImageRemoved(false);

      // Pass the File object to the parent form.
      // The parent is responsible for uploading it to Laravel.
      onChange?.(file);
    },
    [onChange, revokePreviewUrl],
  );

  const { getRootProps, getInputProps, open, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_IMAGE_TYPES,
      maxSize: MAX_FILE_SIZE,
      maxFiles: 1,
      multiple: false,
      disabled,
      noClick: true,
      noKeyboard: true,
    });

  const handleRemove = () => {
    if (disabled) return;
    revokePreviewUrl();
    setSelectedFile(null);
    setPreviewUrl("");
    setErrorMessage("");

    // If an existing server image is being removed,
    // notify the parent so it can submit the deletion.
    if (initialImageUrl && !isExistingImageRemoved) {
      setIsExistingImageRemoved(true);
      onRemove?.();
    }
    onChange?.(null);
  };

  const displayedImage = selectedFile
    ? previewUrl
    : isExistingImageRemoved
      ? ""
      : initialImageUrl;
  const hasImage = Boolean(displayedImage);

  return {
    errorMessage,
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragReject,
    handleRemove,
    displayedImage,
    hasImage,
  };
};

export default useProductImageUploadLogic;
