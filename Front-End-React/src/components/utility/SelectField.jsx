import * as React from "react";
import { Select } from "radix-ui";
import classNames from "classnames";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

// ==================================================
// Select Option
// ==================================================

function SelectOption({ option }) {
  return (
    <Select.Item
      value={String(option.value)}
      textValue={String(option.label)}
      disabled={option.disabled ?? false}
      className={classNames(
        "relative flex min-h-10 cursor-pointer select-none",
        "flex-col justify-center gap-0.5",
        "rounded-md py-2 pl-3 pr-9",
        "text-sm text-slate-700 outline-none",
        "transition-colors duration-150",
        "data-highlighted:bg-sky-50",
        "data-highlighted:text-sky-700",
        "data-[state=checked]:bg-sky-50",
        "data-[state=checked]:text-sky-700",
        "data-disabled:pointer-events-none",
        "data-disabled:opacity-40",
      )}
    >
      <Select.ItemText>{option.label}</Select.ItemText>

      {option.description && (
        <span className="text-xs leading-4 text-slate-400">
          {option.description}
        </span>
      )}

      <Select.ItemIndicator
        className={classNames(
          "absolute right-3 top-1/2",
          "-translate-y-1/2 text-sky-600",
        )}
      >
        <Check size={16} strokeWidth={2.5} />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

// ==================================================
// Select Field
// ==================================================

const SelectField = React.forwardRef(function SelectField(
  {
    // Identification
    id,
    name,
    label,
    labelIcon,
    ariaLabel,

    // Values
    value,
    defaultValue,
    onValueChange,

    // Options
    options = [],
    groups,
    placeholder = "Select an option...",
    emptyMessage = "No options available",

    // State
    disabled = false,
    required = false,
    error,
    helperText,

    // Styles
    className,
    triggerClassName,
    contentClassName,

    // Portal
    portalContainer,
  },
  forwardedRef,
) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  // Normalize options and support groups
  const sourceGroups =
    Array.isArray(groups) && groups.length > 0
      ? groups
      : [{ label: null, options }];

  const normalizedGroups = sourceGroups
    .map((group) => ({
      ...group,
      options: (group.options ?? []).filter(
        (option) =>
          option != null && option.value != null && String(option.value) !== "",
      ),
    }))
    .filter((group) => group.options.length > 0);

  const hasOptions = normalizedGroups.length > 0;

  return (
    <div
      className={classNames("flex w-full min-w-0 flex-col gap-1.5", className)}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={classNames(
            "flex items-center gap-2",
            "text-sm font-medium text-slate-700",
          )}
        >
          {labelIcon && (
            <span className="flex items-center text-slate-500">
              {labelIcon}
            </span>
          )}

          <span>{label}</span>

          {required && (
            <span className="text-rose-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {/* Radix Select */}
      <Select.Root
        name={name}
        value={value === undefined ? undefined : String(value ?? "")}
        defaultValue={
          defaultValue === undefined ? undefined : String(defaultValue ?? "")
        }
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
      >
        {/* Trigger */}
        <Select.Trigger
          ref={forwardedRef}
          id={selectId}
          aria-label={
            ariaLabel ?? (typeof label === "string" ? label : undefined)
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={classNames(
            "flex h-11 w-full min-w-0 items-center justify-between",
            "gap-3 rounded-lg border bg-white px-3",
            "text-left text-sm text-slate-800",
            "shadow-sm outline-none",
            "transition-all duration-200",
            "data-placeholder:text-slate-400",

            // Default state
            !error && [
              "border-slate-300",
              "hover:border-slate-400",
              "focus-visible:border-sky-500",
              "focus-visible:ring-4 focus-visible:ring-sky-100",
              "data-[state=open]:border-sky-500",
              "data-[state=open]:ring-4",
              "data-[state=open]:ring-sky-100",
            ],

            // Error state
            error && [
              "border-rose-400",
              "focus-visible:border-rose-500",
              "focus-visible:ring-4 focus-visible:ring-rose-100",
            ],

            // Disabled state
            "disabled:cursor-not-allowed",
            "disabled:bg-slate-50",
            "disabled:text-slate-400",
            "disabled:opacity-70",

            triggerClassName,
          )}
        >
          <span className="min-w-0 flex-1 truncate">
            <Select.Value placeholder={placeholder} />
          </span>

          <Select.Icon className="flex shrink-0 items-center text-slate-400">
            <ChevronDown size={17} strokeWidth={2} />
          </Select.Icon>
        </Select.Trigger>

        {/* Dropdown */}
        <Select.Portal container={portalContainer}>
          <Select.Content
            position="popper"
            side="bottom"
            align="start"
            sideOffset={6}
            collisionPadding={8}
            className={classNames(
              "z-1000 overflow-hidden",
              "w-(--radix-select-trigger-width)",
              "max-h-(--radix-select-content-available-height)",
              "rounded-xl border border-slate-200",
              "bg-white p-1 shadow-xl",
              "outline-none",
              contentClassName,
            )}
          >
            <Select.ScrollUpButton
              className={classNames(
                "flex h-7 items-center justify-center",
                "text-slate-400",
              )}
            >
              <ChevronUp size={16} />
            </Select.ScrollUpButton>

            <Select.Viewport className="max-h-64 p-1">
              {hasOptions ? (
                normalizedGroups.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {groupIndex > 0 && (
                      <Select.Separator className="my-1 h-px bg-slate-100" />
                    )}

                    <Select.Group>
                      {group.label && (
                        <Select.Label
                          className={classNames(
                            "px-3 py-2",
                            "text-xs font-semibold",
                            "uppercase tracking-wide",
                            "text-slate-400",
                          )}
                        >
                          {group.label}
                        </Select.Label>
                      )}

                      {group.options.map((option) => (
                        <SelectOption
                          key={String(option.value)}
                          option={option}
                        />
                      ))}
                    </Select.Group>
                  </React.Fragment>
                ))
              ) : (
                <div className="px-3 py-5 text-center text-sm text-slate-400">
                  {emptyMessage}
                </div>
              )}
            </Select.Viewport>

            <Select.ScrollDownButton
              className={classNames(
                "flex h-7 items-center justify-center",
                "text-slate-400",
              )}
            >
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Error Message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default SelectField;
