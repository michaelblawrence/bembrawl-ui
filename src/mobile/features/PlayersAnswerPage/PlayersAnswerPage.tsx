import React, { useState, useRef, useEffect } from "react";
import emojiRegex from "emoji-regex";
import "./PlayersAnswerPage.css";
import { Branding } from "../../../core-common/Branding";
import { Grid, TextField, Button } from "@material-ui/core";
import { PageProps } from "../PageProps";
import "emoji-mart/css/emoji-mart.css";
import { BaseEmoji } from "emoji-mart";
import { Picker } from "emoji-mart";

type OnEmojiSubmit = (emoji: string[]) => void;

export function PlayersAnswerPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const answerSlotsN = EmojiGame.Question.EmojiCount;
  const songTitle = EmojiGame.Question.Prompt || "Loading Song Title";
  const onEmojiSubmitted = (emojiEntries: string[]) => {
    props.setMessage.SubmitEmojiAnswer({ payload: { emoji: emojiEntries } });
  };

  return (
    <div>
      <Branding />
      <QuestionSection emojiCount={answerSlotsN} songTitle={songTitle} />
      <EmojiAnswerSlots emojiCount={answerSlotsN} onSubmit={onEmojiSubmitted} />
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

  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  const onSlotChange = (idx: number) => (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    console.log(idx);
    const text = (e && e.target && e.target.value) || "";
    handleSlotChange(text, idx, emojiCount, slotRefs, slotState);
  };

  const onSlotSelect = (idx: number) => (
    e: React.SyntheticEvent<HTMLDivElement, Event>    
  ) => {
    setEmojiIndex(idx);
    console.log(idx);
    console.log(89);
    // setEmojiIndex(idx);
    // const text = (e && e.target && e.target.value) || "";
    // handleSlotChange(text, idx, emojiCount, slotRefs, slotState);
  };

  const slots = new Array(emojiCount).fill(0).map((_, idx) => (
    <Grid item xs={2} key={idx}>
      <TextField
        fullWidth={true}
        ref={slotRefs[idx]}
        onChange={onSlotChange(idx)}
        onSelect={onSlotSelect(idx)}
        inputProps={{ inputMode: "search", style: { textAlign: "center" } }}
        value={slotState[idx][0]}
        // autoFocus={idx === 0}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotState]);

  // const onEmojiSelect = (emojiData: BaseEmoji) => {
  //   slotState[emojiIndex][1](emojiData.native || "");
  //   setEmojiIndex(emojiIndex + 1);
  // };
  
  const onEmojiClick = (emojiData: BaseEmoji) => {
    console.log(`set index ${emojiIndex}`)
    slotState[emojiIndex][1](emojiData.native || "");

    const nextEmptyN = !emojiIndex ? emojiIndex + 1 : emojiIndex;

    console.log(nextEmptyN);

    const nextIdx = slotState.findIndex(([slot]) => !slot);


    
    console.log(nextIdx)
    if (nextIdx >=0 && nextIdx < slotState.length - 1) {

      console.log("131")
      setEmojiIndex(nextIdx);
      console.log(`next index ${emojiIndex}`)

    }  
    else {
      setEmojiIndex(slotState.length - 2);
    }
    console.log(emojiIndex)


    // slotState.forEach(([slot, setSlot], idx) => {
    //   if (slot === "") {
    //     console.log(idx)
    //     setEmojiIndex(idx)
    //   }
    // });
    // setEmojiIndex(emojiIndex + 1);
  };

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

      <Picker
        perLine={11}
        sheetSize={32}
        title={undefined}
        emoji="point_up"
        showSkinTones={false} // both of these required
        showPreview={false} // to remove bottom tab
        // onSelect={onEmojiSelect}
        onClick={onEmojiClick}
      />
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
  if (text !== "" && (!text || !isEmoji(text))) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSlotText] = slotState[idx];
  setSlotText(text);

  const nextIdx = text === "" ? idx : idx + 1;
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
