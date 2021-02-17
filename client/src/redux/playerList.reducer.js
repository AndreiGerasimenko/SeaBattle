import { SET_PLAYER_LIST } from "./action.types"

const initialState = {
    playerList: null
}

export const playerListReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_PLAYER_LIST: return { ...state, 
            playerList: action.payload.map(item => {
                return {...item};
            })
        };
        default: return state;
    }
}