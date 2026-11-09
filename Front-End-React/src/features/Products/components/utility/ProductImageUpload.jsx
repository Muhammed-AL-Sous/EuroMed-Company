import { Box, Card, Flex, Text } from "@radix-ui/themes";
import {
  ImagePlus,
  Upload,
  X,
  RefreshCw,
  AlertCircle,
  ImageDown,
} from "lucide-react";
import useProductImageUploadLogic from "./useProductImageUploadLogic.js";

export default function ProductImageUpload({
  initialImageUrl = "",
  onChange,
  onRemove,
  title,
  subTitle,
  showIcon = false,
  disabled = false,
}) {
  const {
    errorMessage,
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragReject,
    handleRemove,
    displayedImage,
    hasImage,
  } = useProductImageUploadLogic({
    initialImageUrl: initialImageUrl,
    onChange: onChange,
    onRemove: onRemove,
    disabled: disabled,
  });

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

            <Text
              as="p"
              // size="2"
              // color="gray"
              mt="1"
              className="flex items-center gap-1 text-xs sm:text-sm text-slate-600"
            >
              {showIcon && <ImageDown size={16} />}
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

              <Text as="div" className="text-sm sm:text-xl" weight="medium">
                {isDragActive
                  ? "Drop your image here"
                  : "Drag and drop your image"}
              </Text>

              <Text as="p" className="text-xs sm:text-sm" color="gray" mt="2">
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

              <Text
                as="p"
                className="text-[10px] sm:text-xs"
                color="gray"
                mt="4"
              >
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
