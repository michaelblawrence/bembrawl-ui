import React, { useState } from "react";
import "./SetPromptPage.scss";
import { Branding } from "../../../core-common/Branding";
import { Grid, TextField, Button } from "@material-ui/core";
import { PageProps } from "../PageProps";
import { generateInputSetter } from "../../../core/utils/generateInputSetter";
import { QuestionSubjects } from "../SetPromptPage/QuestionSubjects";

type OnPromptSubmit = (prompt: string, subject: string) => void;

export function SetPromptPage(props: PageProps) {
  const onPromptSubmitted = (promptText: string, subject: string) => {
    props.setMessage.SubmitNewPrompt({
      payload: { promptResponse: promptText, promptSubject: subject },
    });
  };

  const subjectChoices = props.state.EmojiGame.Question.SubjectChoices;

  return (
    <div>
      <Branding />
      <PromptInput
        onSubmit={onPromptSubmitted}
        subjectChoices={subjectChoices}
      />
    </div>
  );
}

function PromptInput(props: {
  onSubmit: OnPromptSubmit;
  subjectChoices: string[];
}) {
  const { onSubmit, subjectChoices } = props;
  const [songName, setSongName] = useState("");
  const [subject, setSubject] = React.useState("Song name");
  const [emojiCount] = React.useState(4);

  const handleSongName = generateInputSetter(setSongName);
  const submitEnabled = songName.length > 0;

  const submitPrompt = (): void => onSubmit(songName, subject);

  const onPromptKey = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (submitEnabled && ev.key === "Enter") {
      onSubmit(songName, subject);
      ev.preventDefault();
    }
  };

  return (
    <div className="PromptInput">
      <Grid container justify="center">
        <Grid item xs={8} style={{ height: "15vh", textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>
            "{subject}" in {emojiCount} emoji...
          </h2>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={8} style={{ height: "10vh" }}>
          <QuestionSubjects items={subjectChoices} onChange={setSubject} />
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={8} style={{}}>
          <TextField
            fullWidth={true}
            placeholder={subject}
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
      </Grid>
      <Grid container justify="center" style={{ margin: "20px 0" }}>
        <Button
          className="PromptInput-Button"
          disabled={!submitEnabled}
          onClick={submitPrompt}
          variant="contained"
        >
          Done
        </Button>
      </Grid>
    </div>
  );
}
