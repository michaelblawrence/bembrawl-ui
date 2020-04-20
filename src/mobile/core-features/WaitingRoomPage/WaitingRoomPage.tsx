import React from 'react';
import "./WaitingRoomPage.css";
import { PageState } from "../../core/enums/PageState";
import { Branding } from "../../core-common/Branding";

export function WaitingRoomPage(props: { setPage: (page: PageState) => void }) {
  return (
    <div>
      <Branding />
      <div className="WaitingRoom">
        <header className="WaitingRoom-header">
          <h1>YOU IN THE WAITING ROOM</h1>
          <h2>Check out the big screen!</h2>
        </header>
      </div>
    </div>
  );
}
