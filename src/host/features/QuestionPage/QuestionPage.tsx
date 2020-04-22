import React from "react";
import { PageState } from "../../enums/PageState";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Input, Button, Grid } from "@material-ui/core";
import "./QuestionPage.css";
import { WaitingMessage } from "../../../core-common/WaitingMessage";
import { PageProps } from "../PageProps";

export function QuestionPage(props: PageProps) {
  const {state} = props;
  const [questionString] = useState<String>(state.EmojiGame.QuestionPrompt || "Loading question...");
  const [showAnswers] = useState<boolean>(true);
  const [countDown] = useState<number>(60);
  const [answerList] = useState<String[]>([
    "answer1",
    "answer2",
    "answer3",
    "answer4",
    "answer5",
    "answer6",
    "answer7",
    "answer8",
  ]);
  return (
    <Grid container justify="center" className="Page">
      <Branding />
      <Question questionString={questionString} />
      {/* <Grid container className="QuestionPage"> */}
        <NoAnswersMessage countDown={countDown} />
      {/* </Grid> */}
    </Grid>
  );
}

function Question(props: { questionString: String }) {
  const { questionString } = props;
  return (
    <Grid className="Question" justify="center">
      <h2 className="QuestionString">{questionString}</h2>
    </Grid>
  );
}

function NoAnswersMessage(props: { countDown: number }) {
  const { countDown } = props;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      style={{ height: "70vh" }}
    >
        <h2>Waiting for players to answer!</h2>
        <h1 style={{textAlign: "center"}}>{countDown}</h1>
    </Grid>
  );
}
