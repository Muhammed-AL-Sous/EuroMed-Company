// Reusable display helper for API resources, translated text and simple strings.
export const getEntityName = (entity) => {
  if (entity == null) return "";

  if (typeof entity === "string" || typeof entity === "number") {
    return String(entity);
  }

  if (typeof entity !== "object" || Array.isArray(entity)) return "";

  const value =
    entity.name ?? entity.full_name ?? entity.product_name ?? entity.title;

  if (value != null) {
    return getEntityName(value);
  }

  const completeName = [entity.first_name, entity.last_name]
    .filter(Boolean)
    .map((part) => getEntityName(part))
    .join(" ");

  if (completeName) return completeName;

  const translation =
    entity.en ??
    entity.ar ??
    Object.values(entity).find((item) => typeof item === "string");

  return typeof translation === "string" ? translation : "";
};
