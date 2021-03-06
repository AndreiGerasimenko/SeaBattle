import { useState, useCallback } from 'react'

export const useFieldState = () => {
    const [fieldState, setFieldState] = useState(null);

    const changeState = useCallback((arrayOfChanges) => {
        const newState = JSON.parse(JSON.stringify(fieldState));
        arrayOfChanges.forEach(({ x, y, state }) => {
            newState[x][y] = state;
        })

        setFieldState(newState);
    },[fieldState])

    return {
        fieldState,
        changeState,
        setFieldState
    }
}