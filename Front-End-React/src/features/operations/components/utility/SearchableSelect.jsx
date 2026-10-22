import { useId, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const SearchableSelect = ({
  label,
  options = [],
  value,
  selectedOption = null,
  serverSearch = false,
  onChange,
  onSearchChange,
  getOptionLabel,
  getOptionDetails = () => "",
  placeholder = "Select an option",
  disabled = false,
  isLoading = false,
  error,
}) => {
  const listId = useId();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selected =
    options.find((option) => String(option.id) === String(value)) ??
    (selectedOption && String(selectedOption.id) === String(value)
      ? selectedOption
      : null);

  const filteredOptions = serverSearch
    ? options
    : options.filter((option) => {
        const text = [getOptionLabel(option), getOptionDetails(option)]
          .join(" ")
          .toLowerCase();

        return text.includes(search.trim().toLowerCase());
      });

  const handleSearchChange = (event) => {
    const nextSearch = event.target.value;

    setSearch(nextSearch);
    onSearchChange?.(nextSearch);
  };

  const handleSelect = (option) => {
    onChange(option);
    setSearch("");
    onSearchChange?.("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listId}
          onClick={() => {
            setSearch("");
            setIsOpen((current) => !current);
          }}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-sm text-slate-800 disabled:opacity-50"
        >
          <span className="truncate">
            {selected ? getOptionLabel(selected) : placeholder}
          </span>

          <ChevronDown size={17} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="relative border-b p-2">
              <Search
                size={16}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                autoFocus
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setIsOpen(false);
                  }
                }}
                placeholder={`Search ${label}...`}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div
              id={listId}
              role="listbox"
              className="max-h-56 overflow-y-auto p-1"
            >
              {isLoading ? (
                <p className="p-3 text-center text-sm text-slate-500">
                  Searching...
                </p>
              ) : filteredOptions.length === 0 ? (
                <p className="p-3 text-center text-sm text-slate-500">
                  No results found
                </p>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={String(option.id) === String(value)}
                    onClick={() => handleSelect(option)}
                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-sky-50"
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {getOptionLabel(option)}
                    </p>

                    {getOptionDetails(option) && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {getOptionDetails(option)}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
