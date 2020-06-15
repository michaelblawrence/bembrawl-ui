import React from "react";
import {
  TextField,
  TextFieldProps,
  StandardTextFieldProps,
} from "@material-ui/core";

export function SubmitTextField(props: SubmitTextFieldProps) {
  const onPromptKey = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (!props.disabled && ev.key === "Enter") {
      props.onSubmit && props.onSubmit(ev);
      props.onValue && props.onValue(`${props.value}`);
      ev.preventDefault();
    } else {
      if (props.onKeyPress) props.onKeyPress(ev);
    }
  };
  const { onValue: _, ...standardProps } = props;
  const newProps: TextFieldProps = {
    ...standardProps,
    onKeyPress: onPromptKey,
  };
  return <TextField {...newProps} />;
}

export interface SubmitTextFieldProps extends StandardTextFieldProps {
  onValue?: (value: string) => void;
}
