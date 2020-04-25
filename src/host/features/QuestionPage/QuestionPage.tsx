import React, { useEffect } from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./QuestionPage.css";
import { PageProps } from "../PageProps";
import Timer from "./Timer";
// import { Timer } from "./Timer";

export function QuestionPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const [questionString] = useState<String>(
    EmojiGame.Question.Prompt || "Loading question..."
  );
  const [subjectString] = useState<String>(
    EmojiGame.Question.Subject || "Loading subject..."
  );
  const [counterEndTimeMs, setCounterEndMsTime] = useState<number>(
    EmojiGame.Question.TimeoutMs || 0
  );
  const duration = (new Date().getUTCMilliseconds() - counterEndTimeMs) / 1000;
  useEffect(() => {
    const now: number = new Date().getTime();
    if (EmojiGame.Question.TimeoutMs && EmojiGame.Question.TimeoutMs > now) {
      setCounterEndMsTime(EmojiGame.Question.TimeoutMs);
    }
  }, [EmojiGame]);

  return (
    <Grid container justify="center" className="Page">
      <Branding />
      <Question questionString={questionString} subjectString={subjectString} />
      <NoAnswersMessage duration={duration} />
    </Grid>
  );
}

function Question(props: { questionString: String; subjectString: String }) {
  const { questionString, subjectString } = props;
  return (
    <Grid className="Question" justify="center">
      <h3 className="SubjectString">{subjectString}</h3>
      <h2 className="QuestionString">{questionString}</h2>
    </Grid>
  );
}

function NoAnswersMessage(props: { duration: number }) {
  const { duration } = props;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      style={{ height: "70vh" }}
    >
      <h2>Waiting for players to answer</h2>
      <Timer duration={duration} />
    </Grid>
  );
}
