import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, X } from "lucide-react";

const EditModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,

  title = "Edit",
  itemLabel,

  children,

  submitText = "Save Changes",
  cancelText = "Cancel",

  icon: Icon,
}) => {
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  if (!portalTarget) {
    return null;
  }

  // ==================================================
  // Handlers
  // ==================================================

  const handleClose = () => {
    if (isLoading) return;

    onClose?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoading) return;

    onSubmit?.(event);
  };

  // ==================================================
  // Render
  // ==================================================

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="edit-modal"
          className="
            fixed
            inset-0
            z-9000
            flex
            items-center
            justify-center
            p-4
          "
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* ==================================================
              Backdrop
          ================================================== */}

          <button
            type="button"
            aria-label={cancelText}
            onClick={handleClose}
            disabled={isLoading}
            className="
              absolute
              inset-0
              cursor-default
              bg-slate-950/55
              backdrop-blur-[2px]
            "
          />

          {/* ==================================================
              Modal
          ================================================== */}

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="
              relative
              z-9001
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-[0_20px_60px_rgba(15,23,42,0.18)]
              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            "
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 16,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* ==================================================
                  Header
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-200
                  px-6
                  py-4
                  dark:border-slate-700
                "
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <span
                      className="
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#0084d1]/10
                        text-[#0084d1]
                        dark:bg-[#0084d1]/15
                        dark:text-sky-400
                      "
                    >
                      <Icon size={21} strokeWidth={2} aria-hidden="true" />
                    </span>
                  )}

                  <div>
                    <h2
                      id="edit-modal-title"
                      className="
                        text-lg
                        font-bold
                        text-slate-800
                        dark:text-slate-100
                      "
                    >
                      {title}
                    </h2>

                    {itemLabel && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {itemLabel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Close */}

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  aria-label="Close"
                  className="
                    flex
                    size-8
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:hover:bg-slate-800
                    dark:hover:text-slate-200
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* ==================================================
                  Form Content
              ================================================== */}

              <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

              {/* ==================================================
                  Footer
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                  border-t
                  border-slate-200
                  px-6
                  py-4
                  dark:border-slate-700
                "
              >
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="
                    cursor-pointer
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-slate-600
                    dark:bg-slate-800
                    dark:text-slate-200
                    dark:hover:bg-slate-700
                  "
                >
                  {cancelText}
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    inline-flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0084d1]
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#016dac]
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isLoading && (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {submitText}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  );
};

export default EditModal;
