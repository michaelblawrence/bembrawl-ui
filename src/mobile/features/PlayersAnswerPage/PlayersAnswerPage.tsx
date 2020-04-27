import React, { useState, useRef, useEffect } from "react";
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

  const onSlotSelect = (idx: number) => (
    e: React.SyntheticEvent<HTMLDivElement, Event>
  ) => {
    setEmojiIndex(idx);
  };

  const slots = new Array(emojiCount).fill(0).map((_, idx) => (
    <Grid item xs={2} key={idx}>
      <TextField // TODO stop keyboard showing up when text box clicked
        fullWidth={true}
        ref={slotRefs[idx]}
        // onChange={onSlotChange(idx)}
        onSelect={onSlotSelect(idx)}
        inputProps={{ inputMode: "search", style: { textAlign: "center" } }}
        value={slotState[idx][0]}
      />
    </Grid>
  ));

  const typedEmoji = () =>
    slotState.slice(0, emojiCount).map((state) => state[0]);

  const [isIncomplete, setIsIncomplete] = useState(true);
  const onSubmitClick = () => onSubmit(typedEmoji());
  useEffect(() => {
    const incomplete = typedEmoji().some((text) => !text);
    setIsIncomplete(incomplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotState]);

  const onEmojiClick = (emojiData: BaseEmoji) => {
    slotState[emojiIndex][1](emojiData.native || "");
    const nextEmptyN = !slotState[emojiIndex][0] ? true : false;
    let nextIdx = slotState.findIndex(([slot]) => !slot);

    if (nextEmptyN) {
      nextIdx += slotState.slice(nextIdx + 2).findIndex(([slot]) => !slot) + 1;
    }

    if (nextIdx >= 0 && nextIdx < slotState.length - 1) {
      setEmojiIndex(nextIdx);
    } else {
      setEmojiIndex(slotState.length - 2);
    }

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
        onClick={onEmojiClick}
      />
    </div>
  );
}
