import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

type SelectEvent = {
  name?: string | undefined;
  value: any;
};

export function QuestionSubjects(props: {
  onChange: (subject: string) => void;
  items: string[];
}) {
  const [subject, setSubject] = React.useState(props.items[0] || "");

  const handleChange = (event: React.ChangeEvent<SelectEvent>) => {
    const newSubject = event.target.value;
    setSubject(newSubject);
    props.onChange(newSubject);
  };
  // <em>None</em>

  return (
    <FormControl variant="outlined" fullWidth style={{ color: "white" }}>
      <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={subject}
        onChange={handleChange}
      >
        {props.items.map((item) => (
          <MenuItem value={item}>{item}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
