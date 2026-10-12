import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Box, Card, Flex, Text } from "@radix-ui/themes";

import {
  ImagePlus,
  Upload,
  X,
  RefreshCw,
  FileImage,
  AlertCircle,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export default function ProductImageUpload({
  initialImageUrl = "",
  onChange,
  onRemove,
  title,
  subTitle,
  disabled = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isExistingImageRemoved, setIsExistingImageRemoved] = useState(false);

  // Keep track of the temporary preview URL for cleanup.
  const previewObjectUrlRef = useRef(null);

  // Revoke the temporary URL when the component unmounts.
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

  return (
    <div {...getRootProps()} className="w-full">
      <input {...getInputProps()} />

      <Card size="3" className="w-full">
        <Flex direction="column" gap="3">
          {/* Header */}
          <Box>
            <Text as="div" size="3" weight="medium">
              {/* Product Image */}
              {title}
            </Text>

            <Text as="p" size="2" color="gray" mt="1">
              {/* Upload an image for your product. */}
              {subTitle}
            </Text>
          </Box>

          {/* Image Preview */}
          {hasImage ? (
            <div
              className={[
                "relative overflow-hidden rounded-xl border",
                "border-slate-200 bg-slate-50",
                isDragActive ? "ring-2 ring-blue-500" : "",
              ].join(" ")}
            >
              <img
                src={displayedImage}
                alt="Product preview"
                className="h-64 w-full object-contain p-3"
              />

              {/* Image Actions */}
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  type="button"
                  onClick={open}
                  disabled={disabled}
                  aria-label="Replace product image"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled}
                  aria-label="Remove product image"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Image Information */}
              {/* <div className="border-t border-slate-200 bg-white px-3 py-2">
                <Flex align="center" gap="2">
                  <FileImage size={16} className="shrink-0 text-blue-600" />

                  <Text size="2" color="gray" truncate>
                    {selectedFile ? selectedFile.name : "Current product image"}
                  </Text>
                </Flex>
              </div> */}

              {isDragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90">
                  <Text size="3" weight="medium" color="blue">
                    Drop to replace the image
                  </Text>
                </div>
              )}
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              className={[
                "flex min-h-64 flex-col items-center justify-center",
                "rounded-xl border-2 border-dashed px-5 py-8 text-center",
                "transition-colors",
                disabled
                  ? "cursor-not-allowed bg-slate-100 opacity-60"
                  : "cursor-default",
                isDragReject
                  ? "border-red-400 bg-red-50"
                  : isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50",
              ].join(" ")}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                {isDragReject ? (
                  <AlertCircle size={28} />
                ) : (
                  <ImagePlus size={28} />
                )}
              </div>

              <Text as="div" size="3" weight="medium">
                {isDragActive
                  ? "Drop your image here"
                  : "Drag and drop your image"}
              </Text>

              <Text as="p" size="2" color="gray" mt="2">
                or select an image from your computer
              </Text>

              <button
                type="button"
                onClick={open}
                disabled={disabled}
                className="group mt-4 cursor-pointer transition inline-flex items-center gap-2 rounded-lg bg-[#0084d1] px-4 py-2.5 text-sm font-medium text-white duration-200 hover:bg-[#016dac] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload
                  size={16}
                  className="group-hover:animate-bounce transition"
                />
                Choose Image
              </button>

              <Text as="p" size="1" color="gray" mt="4">
                JPG, PNG or WebP · Maximum 5 MB
              </Text>
            </div>
          )}

          {/* Validation Error */}
          {errorMessage && (
            <Flex align="start" gap="2">
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600" />

              <Text size="2" color="red">
                {errorMessage}
              </Text>
            </Flex>
          )}

          {/* Drag-and-drop hint */}
          {hasImage && isDragActive && (
            <Text size="2" color="blue">
              Release the file to replace the current image.
            </Text>
          )}
        </Flex>
      </Card>
    </div>
  );
}
