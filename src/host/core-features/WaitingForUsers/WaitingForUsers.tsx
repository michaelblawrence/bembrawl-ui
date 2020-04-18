import React from "react";
import { PageState } from "../../core/enums/PageState";
import { useState } from "react";
import { Branding } from "../../../mobile/core-common/Branding";
import { Input, Button, Grid } from "@material-ui/core";
import { WaitingMessage } from "../../../mobile/core-common/WaitingMessage";

export function WaitingForUsers(props: { setPage: (page: PageState) => void }) {

    const [playerNames] = useState(["player1", "player2"])

    const [roomId, setRoomId] = useState<number | null>(null);
    // const onRoomIdChange = generateMappedInputSetter<number | null>(
    //   setRoomId,
    //   (value: string) => parseInt(value.substring(0, 4), 10),
    //   null
    // );
    const submit = () => {
      console.log(roomId);
      props.setPage(PageState.WaitingForUsers);
    };
    return (
      <div className="App">
        <Branding />
        <div className="WaitingForUsers">
          <h1>Enter room ID:</h1>
          <PlayersList playerNames={playerNames} />
          {/* <Input
            placeholder="XXXX"
            // onChange={onRoomIdChange}
            inputProps={{ inputMode: "numeric", style: { textAlign: "center" } }}
            style={{ color: "white" }}
            value={roomId || ""}
          /> */}
          {/* <Button style={{ color: "white" }} onClick={submit}>
            Enter
          </Button> */}
        </div>
        {/* <header className="App-header"> */}
          {/* <h1>Lets get going</h1> */}
          {/* <WaitingMessage /> */}
        {/* </header> */}
      </div>
    );
  }

function PlayersList(props: {playerNames: string[]}) {
    const {playerNames} = props;
    const slots = playerNames.map((name, idx) => (
        <Grid item xl={4} key={idx}>
          <h4>{name}</h4>
        </Grid>
      ));

    return (
    <div className="QuestionSection">
      {slots}
    </div>
    );
}