import React from "react";

export function generateMappedInputSetter<T>(
  setValue: React.Dispatch<React.SetStateAction<T>>,
  mapper: (input: string) => T,
  defaultValue?: T
) {
  return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    try {
      setValue(mapper(e.target.value));
    } catch (ex) {
      defaultValue && setValue(defaultValue);
    }
  };
}
