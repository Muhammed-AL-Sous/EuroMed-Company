const SIZE_CLASS = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const VARIANT_CLASS = {
  primary: "border-red-500 border-t-transparent",
  onPrimary: "border-white border-t-transparent",
};

export function Spinner({
  size = "md",
  variant = "primary",
  className = "",
  ...rest
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        "inline-block shrink-0 rounded-full animate-spin",
        SIZE_CLASS[size] ?? SIZE_CLASS.md,
        VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary,
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

/**
 * لودر مسار / لوحة — مضغوط (سبينر متوسط)، بدون احتلال كامل الشاشة
 */
export function RouteSuspenseFallback({ className = "" }) {
  return (
    <div
      className={`flex w-full min-h-40 flex-1 items-center justify-center ${className}`}
    >
      <Spinner size="md" />
    </div>
  );
}

/**
 * جلب بيانات داخل منطقة المحتوى (مع Sidebar) — سبينر دائري واضح في المنتصف
 */
export function PanelEdgeSpinner({ className = "", size = "lg" }) {
  return (
    <div
      className={`flex min-h-88 w-full items-center justify-center px-4 py-10 sm:min-h-112 ${className}`}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      <Spinner size={size} />
    </div>
  );
}
