import React from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import "./AnswerPage.scss";
import { PageProps } from "../PageProps";

export function AnswerPage(props: PageProps) {
  const answerList = props.state.EmojiGame.PlayerAnswers?.map(
    (answer) => answer.answer
  );
  const [questionString] = useState<string>("Enter a song name");
  return (
    <div className="AppTv">
      <Branding />
      <Question questionString={questionString} />
      <div className="AnswersContainer" style={{ maxHeight: "-webkit-fill-available" }}>
        <Answers answerList={answerList} />
      </div>
    </div>
  );
}

function Question(props: { questionString: string }) {
  const { questionString } = props;
  return (
    <div className="Question">
      <h2 className="QuestionString">{questionString}</h2>
    </div>
  );
}

function Answers(props: { answerList: string[] | undefined }) {
  const { answerList } = props;

  let displacements: number[] = [];

  if (answerList) {
    for (let index = 0; index < answerList.length; index++) {
      displacements.push((Math.random() - 0.5) * 150);
    }
  }

  const answers = (
    <ul
      className="AnswerList"
      style={{ listStylePosition: "inside", paddingLeft: 0 }}
    >
      {answerList &&
        answerList.map((answer, idx) => (
          <li style={{ alignContent: "centre" }}>
            <text
              style={{
                fontSize: "1.5rem",
                height: "0.8vh",
              }}
            >
              {answer}
            </text>
          </li>
        ))}
    </ul>
  );
  return <div className="Answers">{answers}</div>;
}
