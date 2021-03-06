import {
    SET_TABLE_STATE,
    SET_HOVER_STATE,
    SET_SETTING_PROGRESS,
    SET_VISUAL_STATE,
    SET_CELL_SIZE
} from "./action.types";

export const initialFieldState = {
    tableState: Array(10).fill(null).map(() => Array(10).fill(1)),
    hoverState: Array(10).fill(null).map(() => Array(10).fill(0)),
    visualState: [],
    settingProgress: 0,
    cellSize: 50
}

export const setupReducer = (state = initialFieldState, action) => {
    switch(action.type) {
        case SET_TABLE_STATE: 
            return {
                ...state, tableState: action.payload
            }
        case SET_HOVER_STATE: 
            return {
                ...state, hoverState: action.payload
            }
        case SET_SETTING_PROGRESS: 
        const nextProgressState = action.payload != null ?
                                  action.payload : 
                                  state.settingProgress + 1
            return {
                ...state, settingProgress: nextProgressState
            }
        case SET_CELL_SIZE:
            return {
                ...state, cellSize: action.payload
            }
        case SET_VISUAL_STATE:
            const payload = action.payload;
            if(!payload) {
                return {
                    ...state, visualState: []
                }
            }

            const foundIndex = state.visualState.findIndex(item => {
                return item.id === payload.id
            });
            const newArray = [...state.visualState];

            if(foundIndex !== -1) {
                newArray.splice(foundIndex, 1, payload);
            } else {
                newArray.push(payload);
            }

            return {
                ...state, visualState: newArray
            }
        default: 
            return state;
    }
}

