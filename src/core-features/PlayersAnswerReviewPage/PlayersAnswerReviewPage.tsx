import React, { useState, useRef, useEffect } from "react";
import emojiRegex from "emoji-regex";
import "./PlayersAnswerReviewPage.css";
import { PageState } from "../../core/enums/PageState";
import { Branding } from "../../core-common/Branding";
import { Grid, TextField, Button, Container } from "@material-ui/core";

type OnEmojiSubmit = (emoji: string[]) => void;

export function PlayersAnswerReviewPage(props: {
  setPage: (page: PageState) => void;
}) {
  const [answerSlotsN] = useState(5);
  const [songName] = useState("SONG NAME");

  return (
    <div>
      <Branding />
      <QuestionSection answerCount={answerSlotsN} songTitle={songName} />
    </div>
  );
}

function QuestionSection(props: { answerCount: number; songTitle: string }) {
  const { answerCount: rawEmojiCount, songTitle } = props;
  const emojiCount = Math.max(0, Math.min(6, rawEmojiCount));

  const [AnswersN] = useState(6);

  return (
    <div className="QuestionSection">
      <header className="QuestionSection-header">
        <h1 className="QuestionSection-question">
          Describe a song in {emojiCount} emoji...
        </h1>
        <EmojiAnswer answerCount={AnswersN} />
        <h2>{songTitle}</h2>
      </header>
    </div>
  );
}

function EmojiAnswer(props: {
  answerCount: number;
}) {
  const { answerCount } = props;
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

  const slots = new Array(answerCount).fill(0).map((_, idx) => (
    <Grid item xl={4} xs={6} key={idx}>
      <h4>Answer {idx}</h4>
    </Grid>
  ));

  return (
    <div className="EmojiAnswerDisplay">
      <Grid className="EmojiAnswer" container justify="center" spacing={2}>
        {slots}
      </Grid>
    </div>
  );
}
