import { useId, useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
import { useGetOperationFormOptionsQuery } from "../../OperationsApiSlice";
import { getEntityName } from "./OperationEntityUtils";

// Display real names rather than database IDs. API responses may contain
// plain strings, translated objects, or nested relation objects.
const getOptionName = (entity) =>
  getEntityName(entity) ||
  String(entity?.phone ?? entity?.code ?? entity?.sku ?? "Unnamed Record");

const getOptionDetails = (entity, type) => {
  switch (type) {
    case "doctor":
      return getEntityName(entity.specialization);
    case "patient":
      return [entity.phone, entity.email].filter(Boolean).join(" — ");
    case "hospital":
      return [getEntityName(entity.city), entity.type]
        .filter(Boolean)
        .join(" — ");
    case "operation_type":
      return entity.code ?? "";
    case "product":
      return [
        entity.code ?? entity.sku,
        getEntityName(entity.manufacturer),
        getEntityName(entity.category),
        entity.model,
      ]
        .filter(Boolean)
        .join(" — ");
    default:
      return "";
  }
};

const OperationReferenceSelect = ({
  type,
  label,
  value,
  selectedEntity,
  onChange,
  disabled = false,
  error,
}) => {
  const id = useId();
  const listId = `${id}-results`;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  // Query the API only while this particular dropdown is open.
  // The hook is still called unconditionally (React hooks rule).
  const {
    currentData: fetchedOptions = [],
    isFetching,
    isError,
  } = useGetOperationFormOptionsQuery(
    {
      type,
      search: debouncedSearch,
    },
    {
      skip: !isOpen || disabled,
    },
  );

  // Find the selected object from parent state, even when it isn't
  // included in the API's current paginated search results.
  const selected =
    selectedEntity && String(selectedEntity.id) === String(value)
      ? selectedEntity
      : (fetchedOptions.find(
          (option) => String(option?.id) === String(value),
        ) ?? null);

  const options = useMemo(() => {
    const unique = new Map();

    // Keep the selected entity when the search is empty
    if (!search.trim() && selectedEntity?.id != null) {
      unique.set(String(selectedEntity.id), selectedEntity);
    }

    // Use the API results directly
    for (const option of Array.isArray(fetchedOptions) ? fetchedOptions : []) {
      if (option?.id != null) {
        unique.set(String(option.id), option);
      }
    }

    return Array.from(unique.values());
  }, [fetchedOptions, search, selectedEntity]);

  const openDropdown = () => {
    if (disabled) return;
    setSearch("");
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearch("");
    setActiveIndex(-1);
  };

  const handleChoose = (entity) => {
    onChange(String(entity.id), entity);
    closeDropdown();
  };

  const handleKeyDown = (event) => {
    if (!isOpen && ["ArrowDown", "Enter"].includes(event.key)) {
      event.preventDefault();
      openDropdown();
      return;
    }

    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((index) =>
        visibleOptions.length ? (index + 1) % visibleOptions.length : -1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((index) =>
        visibleOptions.length
          ? index <= 0
            ? visibleOptions.length - 1
            : index - 1
          : -1,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const option =
        visibleOptions[activeIndex] ??
        (visibleOptions.length === 1 ? visibleOptions[0] : null);

      if (option) {
        handleChoose(option);
      }
    }
  };
  const waitingForDebounce = search.trim() !== debouncedSearch;
  const visibleOptions = waitingForDebounce ? [] : options;
  return (
    <div
      className="min-w-0 space-y-1.5"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeDropdown();
        }
      }}
    >
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Search
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${id}-option-${activeIndex}`
              : undefined
          }
          autoComplete="off"
          disabled={disabled}
          value={
            isOpen
              ? search
              : selected
                ? getOptionName(selected)
                : String(value ?? "") !== ""
                  ? `Current ${label} (name unavailable)`
                  : ""
          }
          onFocus={openDropdown}
          onChange={(event) => {
            setSearch(event.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${label.toLowerCase()}...`}
          className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60 ${error ? "border-red-500" : "border-slate-200"}`}
        />
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {/* Render in document flow to avoid the EditModal scroll container
          clipping an absolutely-positioned popup. */}
      {isOpen && (
        <div
          id={listId}
          role="listbox"
          aria-label={`${label} results`}
          className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
        >
          {visibleOptions.map((entity, index) => {
            const chosen = String(entity.id) === String(value);
            return (
              <button
                key={entity.id}
                id={`${id}-option-${index}`}
                type="button"
                role="option"
                aria-selected={chosen}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleChoose(entity)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-sky-50 ${activeIndex === index ? "bg-sky-50" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-800">
                    {getOptionName(entity)}
                  </span>
                  {getOptionDetails(entity, type) && (
                    <span className="block truncate text-xs text-slate-500">
                      {getOptionDetails(entity, type)}
                    </span>
                  )}
                </span>
                {chosen && (
                  <Check size={16} className="shrink-0 text-sky-600" />
                )}
              </button>
            );
          })}

          {(isFetching || waitingForDebounce) && (
            <p role="status" className="px-3 py-2 text-xs text-sky-600">
              Searching...
            </p>
          )}
          {!isFetching &&
            !waitingForDebounce &&
            !isError &&
            visibleOptions.length === 0 && (
              <p className="px-3 py-3 text-sm text-slate-500">
                No matching {label.toLowerCase()} found.
              </p>
            )}
          {isError && (
            <p role="alert" className="px-3 py-2 text-sm text-red-600">
              Failed to load available options.
            </p>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default OperationReferenceSelect;
