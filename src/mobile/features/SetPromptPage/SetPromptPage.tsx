import React, { useState } from "react";
import "./SetPromptPage.css";
import { Branding } from "../../../core-common/Branding";
import { Grid, TextField, Button } from "@material-ui/core";
import { PageProps } from "../PageProps";
import { generateInputSetter } from "../../../core/utils/generateInputSetter";

type OnPromptSubmit = (prompt: string) => void;

export function SetPromptPage(props: PageProps) {
  const onPromptSubmitted = (promptText: string) => {
    props.setMessage.SubmitNewPrompt({
      payload: { promptResponse: promptText },
    });
  };

  return (
    <div>
      <Branding />
      <PromptInput onSubmit={onPromptSubmitted} />
    </div>
  );
}

function PromptInput(props: { onSubmit: OnPromptSubmit }) {
  const { onSubmit } = props;
  const [songName, setSongName] = useState("");

  const handleSongName = generateInputSetter(setSongName);
  const submitEnabled = songName.length > 0;

  const submitPrompt = (): void => onSubmit(songName);

  const onPromptKey = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (submitEnabled && ev.key === "Enter") {
      onSubmit(songName);
      ev.preventDefault();
    }
  };

  return (
    <div className="EmojiAnswerSlots">
      <Grid container justify="center" spacing={2}>
        <TextField
          fullWidth={true}
          placeholder="Song Name"
          onChange={handleSongName}
          onKeyPress={onPromptKey}
          inputProps={{
            inputMode: "search",
            style: { textAlign: "center", color: "white" },
          }}
          value={songName}
          autoFocus
        />
      </Grid>
      <Button
        className="EmojiAnswerButton"
        disabled={!submitEnabled}
        onClick={submitPrompt}
      >
        Done
      </Button>
    </div>
  );
}
