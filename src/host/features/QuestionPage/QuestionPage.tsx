import React, { useEffect } from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./QuestionPage.scss";
import { PageProps } from "../PageProps";
import Timer from "./Timer";
import { PlayerGuessTicker } from "../../../core-common/PlayerGuessTicker/PlayerGuessTicker";

export function QuestionPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const nowMs = Date.now();
  const questionString = EmojiGame.Question.Prompt || "Loading question...";
  const subjectString = EmojiGame.Question.Subject || "Loading subject...";
  const [counterEndTimeMs, setCounterEndMsTime] = useState<number>(
    EmojiGame.Question.TimeoutMs || nowMs + 30 * 1000
  );
  const duration = (counterEndTimeMs - nowMs) / 1000;

  useEffect(() => {
    const now: number = Date.now();
    if (EmojiGame.Question.TimeoutMs && EmojiGame.Question.TimeoutMs > now) {
      setCounterEndMsTime(EmojiGame.Question.TimeoutMs);
    }
  }, [EmojiGame.Question.TimeoutMs]);

  const guessInput = EmojiGame.GuessFirst.PlayerGuesses[0]?.text || null;

  return (
    <Grid container justify="center" className="Page">
      <Branding />
      <Question questionString={questionString} subjectString={subjectString} />
      <WaitingMessage duration={duration} />
      <PlayerGuessTicker
        latestGuess={guessInput}
        displayCount={5}
      />
    </Grid>
  );
}

function Question(props: { questionString: string; subjectString: string }) {
  const { questionString, subjectString } = props;
  return (
    <Grid className="Question" justify="center">
      <h3 className="SubjectString">{subjectString}</h3>
      <h2 className="QuestionString">{questionString}</h2>
    </Grid>
  );
}

function WaitingMessage(props: { duration: number }) {
  const { duration } = props;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      style={{ height: "70vh" }}
      className="WaitingMessage"
    >
      <h2>Waiting for players to answer</h2>
      <Timer duration={duration} />
    </Grid>
  );
}
