import React from "react";
import { PageState } from "../../enums/PageState";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Input, Button, Grid } from "@material-ui/core";
import "./QuestionsAndAnswersPage.css";
import { WaitingMessage } from "../../../core-common/WaitingMessage";
import { PageProps } from "../PageProps";

export function QuestionsAndAnswersPage(props: PageProps) {

  // const [playerNames] = useState(["player1", "player2"]);
  const [questionString] = useState<String>("Enter a song name");

  const [answerList] = useState<String[]>(["answer1", "answer2", "answer3", "answer4", "answer5", "answer6", "answer7", "answer8", "answer9", "answer10"]);
  return (
    <div className="App">
      <Branding />
      <Question questionString={questionString} />
      <div>
        <Answers answerList={answerList} />
      </div>
    </div>
  );
}

function Question(props: { questionString: String }) {
  const { questionString } = props;
  return <div className="Question"><h2 className="QuestionString">
    {questionString}
  </h2></div>
}

function Answers(props: { answerList: String[] }) {
  const { answerList } = props;

  let displacements: number[] = [];
  for (let index = 0; index < answerList.length; index++) {
    displacements.push((Math.random() - 0.5)*150)
  }
  const answers =
    <ul>
      {answerList.map((answer, idx) => (
      <li>
        <h2 style={{marginLeft: `${displacements[idx]}%`}}>
          {answer}
        </h2>
      </li>
    ))}
    </ul>;
  return <div className="Answers">
    {answers}
  </div>
}