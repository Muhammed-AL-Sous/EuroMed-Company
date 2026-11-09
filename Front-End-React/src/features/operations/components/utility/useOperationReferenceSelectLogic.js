import { useId, useMemo, useState } from "react";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
import { useGetOperationFormOptionsQuery } from "../../OperationsApiSlice";

const useOperationReferenceSelectLogic = (hookProps0) => {
  const {
    type,
    value,
    selectedEntity,
    onChange,
    disabled = false,
  } = hookProps0;

  const id = useId();
  const listId = `${id}-results`;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);

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

  return {
    id,
    listId,
    isOpen,
    setIsOpen,
    search,
    setSearch,
    activeIndex,
    setActiveIndex,
    isFetching,
    isError,
    selected,
    openDropdown,
    closeDropdown,
    handleChoose,
    handleKeyDown,
    waitingForDebounce,
    visibleOptions,
  };
};

export default useOperationReferenceSelectLogic;
