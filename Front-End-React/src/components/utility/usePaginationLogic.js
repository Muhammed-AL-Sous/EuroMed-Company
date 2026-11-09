const usePaginationLogic = (hookProps0) => {
  const { meta } = hookProps0;

  const {
    current_page: current,
    total_pages: last,
    total_items: total,
    from,
    to,
  } = meta;

  const canPrev = current > 1;
  const canNext = current < last;

  return {
    current,
    last,
    total,
    from,
    to,
    canPrev,
    canNext,
  };
};

export default usePaginationLogic;
