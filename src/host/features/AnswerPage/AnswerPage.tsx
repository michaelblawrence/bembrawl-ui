import React from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import "./AnswerPage.scss";
import { PageProps } from "../PageProps";
import { EmojiRow } from "../../../core/components/EmojiGame/EmojiAnswers";

export function AnswerPage(props: PageProps) {
  const answerList = props.state.EmojiGame.PlayerAnswers?.map(
    (answer) => answer.answerList
  );
  const [questionString] = useState<string>("Enter a song name");
  return (
    <div className="AppTv">
      <Branding />
      <Question questionString={questionString} />
      <div className="AnswersContainer" style={{ maxHeight: "-webkit-fill-available" }}>
        <Answers playerAnswerList={answerList} />
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

function Answers(props: { playerAnswerList: (string[] | undefined)[] | undefined}) {
  const { playerAnswerList } = props;

  let displacements: number[] = [];

  if (playerAnswerList) {
    for (let index = 0; index < playerAnswerList.length; index++) {
      displacements.push((Math.random() - 0.5) * 150);
    }
  }

  const answers = (
    <ul
      className="answerList"
      style={{ listStylePosition: "inside", paddingLeft: 0 }}
    >
      {playerAnswerList &&
        playerAnswerList.map((answerList) => (
          <li style={{ alignContent: "centre" }}>
            <text
              style={{
                fontSize: "1.5rem",
                height: "0.8vh",
              }}
            >
              {answerList && <EmojiRow emojiList={answerList} />}
            </text>
          </li>
        ))}
    </ul>
  );
  return <div className="Answers">{answers}</div>;
}
