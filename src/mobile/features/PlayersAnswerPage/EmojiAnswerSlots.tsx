import React, { useState, useRef, useEffect } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import emojiRegex from "emoji-regex";

export type OnEmojiSubmit = (emoji: string[]) => void;
export type EmojiAnswerSlotsProps = {
  emojiCount: number;
  onSubmit: OnEmojiSubmit;
};
type ChangeInput = React.ChangeEvent<HTMLInputElement>;

export function EmojiAnswerSlots(props: EmojiAnswerSlotsProps) {
  const { emojiCount: rawEmojiCount, onSubmit } = props;
  const { slotRefs, slotState } = useSixSlotsState();
  const emojiCount = Math.max(0, Math.min(slotRefs.length, rawEmojiCount));

  const typedEmoji = () => slotState.slice(0, emojiCount).map((state) => state[0]);
  const [isIncomplete, setIsIncomplete] = useState(true);
  const onSubmitClick = () => onSubmit(typedEmoji());

  const onSlotChange = (idx: number) => (e: ChangeInput) => {
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

  useEffect(() => {
    const incomplete = typedEmoji().some((text) => !text);
    console.log("changed", slotState, "incomplete", incomplete);
    setIsIncomplete(incomplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

function useSixSlotsState() {
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
  return { slotRefs, slotState };
}

function handleSlotChange(
  text: string,
  idx: number,
  totalCount: number,
  slotRefs: React.RefObject<HTMLDivElement>[],
  slotState: [string, React.Dispatch<React.SetStateAction<string>>][]
) {
  if (text !== "" && (!text || !isEmoji(text))) {
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

function isEmoji(text: string) {
  const matches = emojiRegex().exec(text);
  return matches && matches[0];
}
