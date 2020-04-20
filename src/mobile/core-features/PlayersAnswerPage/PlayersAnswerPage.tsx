import React, { useState, useRef, useEffect } from "react";
import emojiRegex from "emoji-regex";
import "./PlayersAnswerPage.css";
import { PageState } from "../../core/enums/PageState";
import { Branding } from "../../core-common/Branding";
import { Grid, TextField, Button } from "@material-ui/core";

type OnEmojiSubmit = (emoji: string[]) => void;

export function PlayersAnswerPage(props: {
  setPage: (page: PageState) => void;
}) {
  const [answerSlotsN, setAnswerSlotsN] = useState(5);
  const [songName, setSongName] = useState("SONG NAME");
  const onEmojiSubmitted = (a: string[]) => {
    alert(a.join("_"));
  };

  return (
    <div>
      <Branding />
      <QuestionSection emojiCount={answerSlotsN} songTitle={songName} />
      <EmojiAnswerSlots emojiCount={answerSlotsN} onSubmit={onEmojiSubmitted} />
      <PlayersCompletionPanel />
    </div>
  );
}

function QuestionSection(props: { emojiCount: number; songTitle: string }) {
  const { emojiCount: rawEmojiCount, songTitle } = props;
  const emojiCount = Math.max(0, Math.min(6, rawEmojiCount));
  return (
    <div className="QuestionSection">
      <header className="QuestionSection-header">
        <h1 className="QuestionSection-question">
          Describe a song in {emojiCount} emoji...
        </h1>
        <h2>{songTitle}</h2>
      </header>
    </div>
  );
}

const isEmoji = (text: string) => {
  const matches = emojiRegex().exec(text);
  return matches && matches[0];
};

function EmojiAnswerSlots(props: {
  emojiCount: number;
  onSubmit: OnEmojiSubmit;
}) {
  const { emojiCount: rawEmojiCount, onSubmit } = props;
  const slotRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const slotState = [
    useState<string>(""),
    useState<string>(""),
    useState<string>(""),
    useState<string>(""),
    useState<string>(""),
    useState<string>(""),
  ];
  const emojiCount = Math.max(0, Math.min(slotRefs.length, rawEmojiCount));

  const onSlotChange = (idx: number) => (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const text = (e && e.target && e.target.value) || "";
    handleSlotChange(text, idx, emojiCount, slotRefs, slotState);
  };

  const slots = new Array(emojiCount).fill(0).map((_, idx) => (
    <Grid item xs={2} key={idx}>
      <TextField
        fullWidth={true}
        ref={slotRefs[idx]}
        onChange={onSlotChange(idx)}
        inputProps={{ inputMode: "search", style: { textAlign: "center" } }}
        value={slotState[idx][0]}
        autoFocus={idx === 0}
      />
    </Grid>
  ));

  const typedEmoji = () =>
    slotState.slice(0, emojiCount).map((state) => state[0]);

  const [isIncomplete, setIsIncomplete] = useState(true);
  const onSubmitClick = () => onSubmit(typedEmoji());
  useEffect(() => {
    const incomplete = typedEmoji().some((text) => !text);
    console.log("changed", slotState, "incomplete", incomplete);
    setIsIncomplete(incomplete);
  }, [slotState]);
  return (
    <div className="EmojiAnswerSlots">
      <Grid container justify="center" spacing={2}>
        {slots}
      </Grid>
      <Button
        className="EmojiAnswerButton"
        disabled={isIncomplete}
        onClick={onSubmitClick}
      >
        Done
      </Button>
    </div>
  );
}

function handleSlotChange(
  text: string,
  idx: number,
  totalCount: number,
  slotRefs: React.RefObject<HTMLDivElement>[],
  slotState: [string, React.Dispatch<React.SetStateAction<string>>][]
) {
  if (!text || !isEmoji(text)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSlotText] = slotState[idx];
  setSlotText(text);

  const nextIdx = idx + 1;
  const nextRef =
    nextIdx < totalCount && slotRefs[nextIdx] && slotRefs[nextIdx].current;

  if (nextRef) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setNextSlotText] = slotState[nextIdx];
    setNextSlotText("");
    nextRef.focus();
    const input = nextRef.querySelector("input");
    if (input) {
      input.focus();
    }
  }
}

function PlayersCompletionPanel() {
  return <div className="PlayersCompletionPanel"></div>;
}