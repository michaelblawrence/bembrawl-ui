import React, { useState, useRef, useEffect } from "react";
import "emoji-mart/css/emoji-mart.css";
import "./PlayersAnswerPage.scss";
import { Branding } from "../../../core-common/Branding";
import { Grid, TextField, Button } from "@material-ui/core";
import { PageProps } from "../PageProps";
import { BaseEmoji, Emoji } from "emoji-mart";
import { Picker } from "emoji-mart";
import useWindowDimensions, { mapDimensionsToEmojiSizes } from "./utils";

export function PlayersAnswerPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const answerSlotsN = EmojiGame.Question.EmojiCount;
  const prompt = EmojiGame.Question.Prompt || "Loading Song Title";
  const subject = EmojiGame.Question.Subject || "Describe something";
  const { height, width } = useWindowDimensions();
  const { perLine, emojiSize } = mapDimensionsToEmojiSizes(height, width);

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

  const rawEmojiCount = answerSlotsN;

  const numberOfEmojis = 6;
  const emojiCount = Math.max(0, Math.min(numberOfEmojis, rawEmojiCount));

  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  const onSlotSelect = (idx: number) => (
    e: React.SyntheticEvent<HTMLDivElement, Event>
  ) => {
    setEmojiIndex(idx);
  };

  const slots = new Array(emojiCount).fill(0).map((_, idx) => (
    <Grid
      item
      xs={2}
      key={idx}
      direction="column"
      alignContent="center"
      className="EmojiSlot"
    >
      <div
        onSelect={onSlotSelect(idx)}
        onMouseDown={onSlotSelect(idx)}
        className={`PickedEmoji-${idx}`}
        style={
          slotState[idx][0] && emojiIndex === idx
            ? { opacity: 0.7, borderBottom: "dashed" }
            : { borderBottom: "ridge" }
        }
      >
        <Emoji
          set={"apple"}
          emoji={slotState[idx][0] || "grey_question"}
          size={emojiSize}
        />
      </div>
    </Grid>
  ));

  const typedEmoji = () =>
    slotState.slice(0, emojiCount).map((state) => state[0]);

  const [isIncomplete, setIsIncomplete] = useState(true);
  const onSubmitClick = () => onEmojiSubmitted(typedEmoji());
  useEffect(() => {
    const incomplete = typedEmoji().some((text) => !text);
    setIsIncomplete(incomplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotState]);

  const onEmojiClick = (emojiData: BaseEmoji) => {
    slotState[emojiIndex][1](emojiData.colons || "");
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

  const onEmojiSubmitted = (emojiEntries: string[]) => {
    props.setMessage.SubmitEmojiAnswer({ payload: { emoji: emojiEntries } });
  };

  return (
    <div className="PlayersAnswerPage">
      <Branding />
      <QuestionSection
        emojiCount={answerSlotsN}
        playerPrompt={prompt}
        subject={subject}
      />
      <AnswerSlots
        slots={slots}
        isIncomplete={isIncomplete}
        onSubmitClick={onSubmitClick}
      />
      <Grid container justify={"center"}>
        <Picker
          perLine={perLine}
          emojiSize={emojiSize}
          showSkinTones={false} // both of these required
          showPreview={false} // to remove bottom tab
          onClick={onEmojiClick}
          darkMode={true}
          sheetSize={64}
          set={"apple"}
        />
      </Grid>
    </div>
  );
}

function AnswerSlots(props: {
  slots: JSX.Element[];
  isIncomplete: boolean;
  onSubmitClick: () => void;
}) {
  const { slots, isIncomplete, onSubmitClick } = props;
  // (slots: JSX.Element[], isIncomplete: boolean, onSubmitClick: () => void) {
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

function QuestionSection(props: {
  emojiCount: number;
  playerPrompt: string;
  subject: string;
}) {
  const { emojiCount: rawEmojiCount, playerPrompt, subject } = props;
  const emojiCount = Math.max(0, Math.min(6, rawEmojiCount));
  return (
    <div className="QuestionSection">
      <header className="QuestionSection-header">
        <h1 className="QuestionSection-question">
          "{subject}" in {emojiCount} emoji...
        </h1>
        <h2>{playerPrompt}</h2>
      </header>
    </div>
  );
}
