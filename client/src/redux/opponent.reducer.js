import { 
    SET_OPPONENT_ID,
    SET_OPPONENT_NICKNAME,
    SET_CHAT_CONNECTION
 } from "./action.types";

 const initialState = {
    opponentId: null,
    opponentNickname: null,
    chatConnection: null
}

export const opponentReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_OPPONENT_ID: return { ...state, opponentId: action.payload };
        case SET_OPPONENT_NICKNAME: return { ...state, opponentNickname: action.payload };
        case SET_CHAT_CONNECTION: return { ...state, chatConnection: action.payload };
        default: return state;
    }
}