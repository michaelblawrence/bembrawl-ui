import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import "./PlayerGuessInput.scss";
import { generateInputSetter } from "../../../../core/utils/generateInputSetter";
import { classList } from "../../../../core/utils/classList";
import { SubmitTextField } from "./SubmitTextField";

export function PlayerGuessInput(props: {
  onGuess: (guess: string) => boolean;
}) {
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [wrongAnswerShake, setWrongAnswerShake] = useState(false);
  useEffect(() => {
    if (wrongAnswerCount <= 0) return;
    setWrongAnswerShake(true);
    const handle = setTimeout(() => setWrongAnswerShake(false), 300);
    return () => {
      setWrongAnswerShake(false);
      clearTimeout(handle);
    };
  }, [wrongAnswerCount]);
  const onPromptSubmitted = (promptAnswer: string) => {
    const secretMatch = props.onGuess(promptAnswer);
    console.log({ secretMatch });
    if (!secretMatch) setWrongAnswerCount((prev) => prev + 1);
  };
  return (
    <PromptInputSlot onSubmit={onPromptSubmitted} shake={wrongAnswerShake} />
  );
}

function PromptInputSlot(props: {
  onSubmit: (promptAnswer: string) => void;
  shake?: boolean;
}) {
  const [promptAnswer, setPromptAnswer] = useState("");
  const onChange = generateInputSetter(setPromptAnswer);
  const onSubmitClick = () => {
    props.onSubmit(promptAnswer);
    setPromptAnswer("");
  };
  return (
    <div className="PromptInputSlot">
      <Grid container justify="center" spacing={2}>
        <Grid
          item
          xs={9}
          className={classList({
            "PromptInputSlot-SubmitTextField": true,
            shake: props.shake,
          })}
        >
          <SubmitTextField
            fullWidth={true}
            onChange={onChange}
            onValue={onSubmitClick}
            inputProps={{
              inputMode: "search",
              style: { textAlign: "center", color: "white" },
            }}
            value={promptAnswer}
            autoFocus
          />
        </Grid>
      </Grid>
      <Button
        className="PromptInputButton"
        disabled={!promptAnswer}
        onClick={onSubmitClick}
      >
        Done
      </Button>
    </div>
  );
}
