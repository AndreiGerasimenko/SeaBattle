import { 
        SET_TOKEN, 
        SET_USERID, 
        SET_REFRESH_TOKEN,
        SET_GLOBAL_WS_CONNECTION
     } from "./action.types"

const initialState = {
    token: null,
    userId: null,
    refreshToken: null,
    globalWsConnection: null
}

export const authApp = (state = initialState, action) => {
    switch(action.type) {
        case SET_TOKEN: return { ...state, token: action.payload };
        case SET_REFRESH_TOKEN: return { ...state, refreshToken: action.payload };
        case SET_USERID: return { ...state, userId: action.payload };
        case SET_GLOBAL_WS_CONNECTION: return { ...state, globalWsConnection: action.payload};
        default: return state;
    }
}