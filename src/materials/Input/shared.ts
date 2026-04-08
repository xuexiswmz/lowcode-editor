import { useLayoutEffect, useState } from "react";
import { useDebounceFunction } from "../../hooks/useDebounce";
import { useComponentsStore } from "../../stores/components";

export function useManagedInputValue(id: number, value: unknown) {
  const { updateComponentProps } = useComponentsStore();
  const [inputValue, setInputValue] = useState<string>(String(value ?? ""));

  useLayoutEffect(() => {
    setInputValue(String(value ?? ""));
  }, [value]);

  const [debouncedUpdateValue] = useDebounceFunction((...args: unknown[]) => {
    const nextValue = String(args[0] ?? "");
    updateComponentProps(id, { value: nextValue });
  }, 300);

  return {
    inputValue,
    setInputValue,
    debouncedUpdateValue,
  };
}
