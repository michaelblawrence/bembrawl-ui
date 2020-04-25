import React from "react";
import { PageState } from "../../enums/PageState";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Input, Button, Grid } from "@material-ui/core";
import "./AnswerPage.css";
import { WaitingMessage } from "../../../core-common/WaitingMessage";
import { PageProps } from "../PageProps";

export function AnswerPage(props: PageProps) {

  const [questionString] = useState<String>("Enter a song name");
  const [showAnswers] = useState<boolean>(true);
  const [countDown] = useState<number>(60);
  const [answerList] = useState<String[]>(["answer1", "answer2", "answer3", "answer4", "answer5", "answer6", "answer7", "answer8"]);
  return (
    <div className="App">
      <Branding />
      <Question questionString={questionString} />
      <div style={{maxHeight: "-webkit-fill-available"}}>
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
    displacements.push((Math.random() - 0.5) * 150)
  }

  const answers =
    <ul className="AnswerList" style={{listStylePosition:"inside", paddingLeft:0}}>
      {answerList.map((answer, idx) => (
      <li style={{alignContent:"centre"}}>
        <text style={{
          fontSize: "1.5rem",
          height: "0.8vh"
          }}>
          {answer}
        </text>
      </li>
    ))}
    </ul>;
  return <div className="Answers">
    {answers}
  </div>
}
