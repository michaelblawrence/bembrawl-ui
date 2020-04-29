import React from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./ResultsPage.scss";
import { PageProps } from "../PageProps";
import { Emoji } from "emoji-mart";

export function ResultsPage(props: PageProps) {
  const { EmojiGame, RoomInfo } = props.state;

  const playerAnswers = EmojiGame.PlayerAnswers;
  // Todo: refactor state methods (e.g. get user name from ID)
  const playerAnswersWithNames = playerAnswers?.map((answer) => {
    console.log(RoomInfo.players, answer.playerIndex);
    const playerName = RoomInfo.players.find(
      (player) => player.playerIndex === answer.playerIndex
    )?.playerName;
    return { ...answer, playerName: playerName };
  });

  const sortedResults = playerAnswersWithNames
    ?.slice(0)
    .sort((p1, p2) => (p2.votes || 0) - (p1.votes || 0));

  console.log(sortedResults);
  const sortedModifiedResults = sortedResults?.map((answer) => {
    let emojiList = [];
  for (var i = 0; i < answer.answer.length; i++) {
    const emoji = answer.answer.charAt(i)
    emojiList.push(emoji)
  }
    // let normalisedAnswer = "";

    answer = {...answer,
              answerList: emojiList
              }
    return answer
  });


  return (
    <div className="ResultsPage">
      <Branding />
      <Grid
        container
        direction="column"
        alignContent="center"
        alignItems="center"
        justify="center"
        className="ResultsTable"
      >
        <Grid container direction="row">
          <Grid item xs={4} className="ColumnTitle">
            <h1>Player</h1>
          </Grid>
          <Grid item xs={4} className="ColumnTitle">
            <h1>Answer</h1>
          </Grid>
          <Grid item xs={4} className="ColumnTitle">
            <h1>Votes</h1>
          </Grid>
        </Grid>
        {sortedResults?.map((answer) => (
          <Row
            playerName={answer.playerName || "Unknown"}
            playerAnswer={answer.answerList && answer.answerList}
            answerVotes={answer.votes || 0}
          />
        )) || ( // TODO: add a separate component for Waiting message? like the branding banner?
          <Row
            playerName={""}
            playerAnswer={undefined}
            answerVotes={0}
            hideScores={true}
          />
        )}
      </Grid>
    </div>
  );
}

function Row(props: {
  playerName: string;
  playerAnswer: string[] | undefined;
  answerVotes: number;
  hideScores?: boolean;
}) {
  const { playerName, playerAnswer, answerVotes, hideScores } = props;
  return (
    <Grid container direction="row" className="Row">
      <Grid item xs={4} className="Cell">
        {playerName}
      </Grid>
      <Grid item xs={4} className="Cell">
        {playerAnswer && playerAnswer.map((emoji) => (
          <Emoji emoji={emoji} set={"apple"} size={40} />
        )) }
      </Grid>
      {!hideScores && (
        <Grid item xs={4} className="Cell">
          {answerVotes}
        </Grid>
      )}
    </Grid>
  );
}

// function normalisedEmojis(props: {
//   emojis: string
// }) {

//   for (var i = 0; i < emojis.length; i++) {
//     const emoji = emojis.charAt(i)
//     console.log(emoji)
//     // alert(str.charAt(i));
//     let emojiO = Emoji({"emoji": emoji, "size": 24})
//     console.log(emojiO)
//     const emojiObject = Emoji({"size": 36, "emoji": answer.answer, "set": "apple"})
//     normalisedAnswer.concat(emojiObject)
//   }
  
// }