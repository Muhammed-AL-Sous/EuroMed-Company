import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,

  title,
  message,
  itemLabel,

  confirmText = "Confirm",
  cancelText = "Cancel",

  icon: Icon,

  confirmButtonClassName = "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",

  titleClassName = "text-slate-800 dark:text-slate-100",
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

  const handleConfirm = () => {
    if (isLoading) return;

    onConfirm?.();
  };

  // ==================================================
  // Render
  // ==================================================

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirm-action-modal"
          className="
            fixed
            inset-0
            z-60
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
              bg-slate-950/55
              backdrop-blur-[2px]
            "
          />

          {/* ==================================================
              Modal
          ================================================== */}

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-action-title"
            aria-describedby="confirm-action-description"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="
              relative
              z-61
              w-full
              max-w-md
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
            {/* ==================================================
                Content
            ================================================== */}

            <div className="p-6">
              {/* ==================================================
                  Title
              ================================================== */}

              <h2
                id="confirm-action-title"
                className={`
                  flex
                  items-center
                  gap-3
                  text-lg
                  font-bold
                  ${titleClassName}
                `}
              >
                {Icon && (
                  <span
                    className="
                      flex
                      size-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-50
                      text-red-600
                      dark:bg-red-500/10
                      dark:text-red-400
                    "
                  >
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </span>
                )}

                <span>{title}</span>
              </h2>

              {/* ==================================================
                  Message
              ================================================== */}

              <div
                id="confirm-action-description"
                className="
                  mt-5
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                  text-sm
                  leading-relaxed
                  text-slate-700
                  dark:border-slate-700
                  dark:bg-slate-800/60
                  dark:text-slate-300
                "
              >
                {message && <p className="font-semibold">{message}</p>}

                {itemLabel && (
                  <div className="mt-3 rounded-lg text-center border border-[#016dac] bg-[#016dac]/20 px-3 py-2 font-semibold text-white">
                    {itemLabel}
                  </div>
                )}
              </div>

              {/* ==================================================
                  Actions
              ================================================== */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  justify-end
                  gap-2
                "
              >
                {/* Cancel */}
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
                    transition-all
                    duration-200
                    hover:border-slate-300
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

                {/* Confirm */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`
                    inline-flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${confirmButtonClassName}
                  `}
                >
                  {isLoading && (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  );
};

export default DeleteConfirmModal;
