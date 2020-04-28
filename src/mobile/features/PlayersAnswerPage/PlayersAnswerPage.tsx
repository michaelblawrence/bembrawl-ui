import React, { useState } from "react";
import "./PlayersAnswerPage.scss";
import { Branding } from "../../../core-common/Branding";
import { PageProps } from "../PageProps";
import { QuestionSection } from "./QuestionSection";
import { EmojiAnswerSlots } from "./EmojiAnswerSlots";
import {
  Grid,
  TextField,
  Button,
  TextFieldProps,
  StandardTextFieldProps,
} from "@material-ui/core";
import { generateInputSetter } from "../../../core/utils/generateInputSetter";

export function PlayersAnswerPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const answerSlotsN = EmojiGame.Question.EmojiCount;
  const secretGame = EmojiGame.Question.SecretGame;
  const emojiInput = !secretGame || EmojiGame.Question.EmojiInputRequired;
  const emojiPost = !secretGame || !EmojiGame.Question.EmojiInputRequired;
  const prompt = EmojiGame.Question.Prompt || "Loading Song Title";
  const subject = EmojiGame.Question.Subject || "Describe something";

  const onEmojiSubmitted = (emojiEntries: string[]) => {
    if (emojiPost) {
      props.setMessage.SubmitEmojiAnswer({ payload: { emoji: emojiEntries } });
    } else {
      props.setMessage.SubmitPromptMatch({
        payload: {
          promptAnswer: prompt,
          promptEmoji: emojiEntries.join(""),
          promptSubject: subject,
        },
      });
    }
  };

  const [testMessage, setTestMessage] = useState("");
  const onPromptSubmitted = (promptAnswer: string) => {
    const toSecret = (secret: string) =>
      secret
        .toLocaleLowerCase()
        .split(" ")
        .filter((word) => word)
        .join("_");
    const secretMatch =
      toSecret(promptAnswer) === toSecret(EmojiGame.Question.Secret || "");
    console.log({ secretMatch });
    setTestMessage("your answer is " + (secretMatch ? "true" : "false"));
    // props.setMessage.SubmitPromptMatch({
    //   payload: { promptAnswer, promptEmoji: prompt, promptSubject: subject },
    // });
  };

  const [toggleOn, setToggleOn] = useState(false);

  return (
    <div onClick={() => setToggleOn(!toggleOn)}>
      <Branding />
      <QuestionSection
        emojiCount={answerSlotsN}
        playerPrompt={prompt}
        subject={subject}
      />
      {!emojiInput && <PromptInputSlot onSubmit={onPromptSubmitted} />}
      {emojiInput && (
        <EmojiAnswerSlots
          emojiCount={answerSlotsN}
          onSubmit={onEmojiSubmitted}
        />
      )}
      {!emojiInput && testMessage}
    </div>
  );
}

function PromptInputSlot(props: { onSubmit: (promptAnswer: string) => void }) {
  const [promptAnswer, setPromptAnswer] = useState("");
  const onChange = generateInputSetter(setPromptAnswer);
  const onSubmitClick = () => props.onSubmit(promptAnswer);
  return (
    <div className="EmojiAnswerSlots">
      <Grid container justify="center" spacing={2}>
        <Grid item xs={9}>
          <SubmitTextField
            fullWidth={true}
            onChange={onChange}
            onValue={onSubmitClick}
            inputProps={{ inputMode: "search", style: { textAlign: "center" } }}
            value={promptAnswer}
            autoFocus
          />
        </Grid>
      </Grid>
      <Button
        className="EmojiAnswerButton"
        disabled={!promptAnswer}
        onClick={onSubmitClick}
      >
        Done
      </Button>
    </div>
  );
}

interface SubmitTextFieldProps extends StandardTextFieldProps {
  onValue?: (value: string) => void;
}

function SubmitTextField(props: SubmitTextFieldProps) {
  const onPromptKey = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (!props.disabled && ev.key === "Enter") {
      props.onSubmit && props.onSubmit(ev);
      props.onValue && props.onValue(`${props.value}`);
      ev.preventDefault();
    } else {
      if (props.onKeyPress) props.onKeyPress(ev);
    }
  };
  const newProps: TextFieldProps = { ...props, onKeyPress: onPromptKey };
  return <TextField {...newProps} />;
}
