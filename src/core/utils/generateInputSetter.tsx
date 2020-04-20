import React from "react";

export function generateInputSetter(
  setValue: React.Dispatch<React.SetStateAction<string>>
) {
  return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setValue(e.target.value);
}
