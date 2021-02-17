import { SET_TOKEN, 
         SET_USERID, 
         SET_PLAYER_LIST, 
         SET_REFRESH_TOKEN,
         SET_GLOBAL_WS_CONNECTION,
         SET_OPPONENT_ID,
         SET_OPPONENT_NICKNAME,
         SET_CHAT_CONNECTION,
         SET_TABLE_STATE,
         SET_HOVER_STATE,
         SET_SETTING_PROGRESS,
         SET_VISUAL_STATE, 
         SET_CELL_SIZE } from "./action.types";

export const setToken = (jwtTooken) => {
    return {
        type: SET_TOKEN,
        payload: jwtTooken
    }
}

export const setRefreshToken = (refreshToken) => {
    return {
        type: SET_REFRESH_TOKEN,
        payload: refreshToken
    }
}

export const setUserID = (id) => {
    return {
        type: SET_USERID,
        payload: id
    }
}

export const setPlayerList = (playerList) => {
    return {
        type: SET_PLAYER_LIST,
        payload: playerList
    }
}

export const setGlobalWsConnection = (ws) => {
    return {
        type: SET_GLOBAL_WS_CONNECTION,
        payload: ws
    }
}

export const setOpponentID = (id) => {
    return {
        type: SET_OPPONENT_ID,
        payload: id
    }
}

export const setOpponentNickname = (nickName) => {
    return {
        type: SET_OPPONENT_NICKNAME,
        payload: nickName
    }
}

export const setChatConnection = (ws) => {
    return {
        type: SET_CHAT_CONNECTION,
        payload: ws
    }
}

export const setTableState = (array) => {
    const newArray = [...array];
    return {
        type: SET_TABLE_STATE,
        payload: newArray
    }
}

export const setHoverState = (array) => {
    const newArray = [...array];
    return {
        type: SET_HOVER_STATE,
        payload: newArray
    }
}

export const nextSettingStage = () => {
    return {
        type: SET_SETTING_PROGRESS,
    }
}

export const setVisualState = (ship) => {
    return {
        type: SET_VISUAL_STATE,
        payload: ship
    }
}

export const setCellSize = (size) => {
    return {
        type: SET_CELL_SIZE,
        payload: size
    }
}


