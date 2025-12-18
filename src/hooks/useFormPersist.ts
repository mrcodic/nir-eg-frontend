import { useEffect, useState } from "react";
import { FieldValues, UseFormSetValue, UseFormWatch } from "react-hook-form";

export interface FormPersistConfig<T extends FieldValues> {
  storage?: Storage;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  exclude?: string[];
  onDataRestored?: (data: any) => void;
  validate?: boolean;
  dirty?: boolean;
  onTimeout?: () => void;
  timeout?: number;
}

const useFormPersist = <T extends FieldValues>(
  name: string,
  {
    storage,
    watch,
    setValue,
    exclude = [],
    onDataRestored,
    validate = false,
    dirty = false,
    onTimeout,
    timeout,
  }: FormPersistConfig<T>
) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStorage = (): Storage | null => {
    if (typeof window === "undefined") return null;
    return storage || window.localStorage;
  };

  const clearStorage = () => {
    const storageInstance = getStorage();
    if (storageInstance) {
      storageInstance.removeItem(name);
    }
  };

  // Restore data from storage on mount (client-side only)
  useEffect(() => {
    if (!isMounted) return;

    const storageInstance = getStorage();
    if (!storageInstance) return;

    try {
      const str = storageInstance.getItem(name);
      if (!str) return;

      const parsed = JSON.parse(str);
      const { _timestamp = null, ...values } = parsed;

      // Check timeout
      if (timeout && _timestamp) {
        const currTimestamp = Date.now();
        if (currTimestamp - _timestamp > timeout) {
          onTimeout?.();
          clearStorage();
          return;
        }
      }

      // Restore values
      Object.keys(values).forEach((key) => {
        if (!exclude.includes(key)) {
          setValue(key as any, values[key], {
            shouldValidate: validate,
            shouldDirty: dirty,
          });
        }
      });

      if (onDataRestored) {
        onDataRestored(values);
      }
    } catch (error) {
      console.error(
        `[useFormPersist] Failed to restore data for "${name}":`,
        error
      );
      clearStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, name]);

  // Persist watched values to storage
  useEffect(() => {
    if (!isMounted) return;

    const storageInstance = getStorage();
    if (!storageInstance) return;

    const subscription = watch((values) => {
      try {
        const valuesToStore: any = { ...values };

        // Remove excluded keys
        exclude.forEach((key) => {
          delete valuesToStore[key];
        });

        if (Object.keys(valuesToStore).length === 0) return;

        if (timeout !== undefined) {
          valuesToStore._timestamp = Date.now();
        }

        storageInstance.setItem(name, JSON.stringify(valuesToStore));
      } catch (error) {
        console.error(
          `[useFormPersist] Failed to persist data for "${name}":`,
          error
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [isMounted, watch, name, exclude, timeout, storage]);

  return {
    clear: clearStorage,
  };
};

export default useFormPersist;
