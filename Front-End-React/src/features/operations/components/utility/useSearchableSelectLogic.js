import { useId, useState } from "react";

const useSearchableSelectLogic = (hookProps0) => {
  const {
    options = [],
    value,
    selectedOption = null,
    serverSearch = false,
    onChange,
    onSearchChange,
    getOptionLabel,
    getOptionDetails = () => "",
  } = hookProps0;

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

  return {
    listId,
    search,
    setSearch,
    isOpen,
    setIsOpen,
    selected,
    filteredOptions,
    handleSearchChange,
    handleSelect,
  };
};

export default useSearchableSelectLogic;
