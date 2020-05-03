import { Messages } from "../enums/PageState";
import { time } from "console";
import Timer from "./QuestionPage/Timer";

export interface PageProps {
  setMessage: Messages;
  state: HostState;
}

export interface HostState {
  EmojiGame: {
    Question: {
      Prompt?: string;
      PromptPlayerName?: string;
      Subject?: string;
      TimeoutMs?: number;
    };
    PlayerAnswers?: {
      playerIndex?: number; // TODO: delete when/if no longer in use
      playerId?: string;
      votes?: number;
      answerList?: string[];
    }[];
    GameDetails?: {
      PlayerScores: {
        playerId: string;
        playerScore: number;
      };
      CurrentRound: number;
      TotalRounds: number;
    };
  };
  RoomInfo: {
    roomId?: number;
    players: {
      playerIndex: number;
      playerName: string;
      playerId?: string;
    }[];
    lastJoined?: {
      displayUntilMs: number;
      playerIndex: number;
    };
  };
}

export const InitialHostState: HostState = {
  EmojiGame: { Question: {} },
  RoomInfo: {
    players: [],
  },
};

export const TestHostState: HostState = {
  EmojiGame: {
    Question: {
      Prompt: "Poker Face",
      Subject: "Song name",
      TimeoutMs: Date.now() + 60*3*1000,
      PromptPlayerName: "test-player-1",
    },
    PlayerAnswers: [
      {answerList: [":thumbsup:"], playerId: "afde12", playerIndex: 1, votes: 2},
      {answerList: [":grey_question:"], playerId: "25edca", playerIndex: 2, votes: 0},
      {answerList: [":question:"], playerId: "97efb1", playerIndex: 3, votes: 10},
    ] 
  },
  RoomInfo: {
    players: [
      { playerIndex: 1, playerName: "test-player-1", playerId: "afde12" },
      { playerIndex: 2, playerName: "test-player-2", playerId: "25edca" },
      { playerIndex: 3, playerName: "test-player-3", playerId: "97efb1" },
    ],
    lastJoined: { displayUntilMs: 1000, playerIndex: 3 },
  },
};
