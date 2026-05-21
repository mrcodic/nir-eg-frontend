type MapApiErrorsToFormOptions = {
  fieldMap?: Record<string, string>;
};

export const mapApiErrorsToForm = (
  errors: Record<string, string[]>,
  setError: (name: string, error: { message: string }) => void,
  options: MapApiErrorsToFormOptions = {},
) => {
  const { fieldMap } = options;
  Object.entries(errors).forEach(([key, value]) => {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string") {
      const mappedKey = fieldMap?.[key] ?? key;
      setError(mappedKey, { message });
    }
  });
};

