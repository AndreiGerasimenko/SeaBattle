import { combineReducers } from "redux"
import { authApp } from "./auth.reducer";
import { playerListReducer } from "./playerList.reducer";
import { opponentReducer } from "./opponent.reducer";
import { setupReducer } from "./gameFieldSetup.reducer";

export const rootReducer = combineReducers({ auth: authApp,
                                             players: playerListReducer,
                                             opponent: opponentReducer,
                                             gameFieldSetup: setupReducer });
