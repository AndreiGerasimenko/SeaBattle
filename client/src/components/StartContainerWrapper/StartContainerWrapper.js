import React from 'react';
import { useSelector } from 'react-redux';
import { StartContainer } from '../StartContainer/StartContainer';
import { Ship } from '../Ship/Ship';

const progressArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 0];

export const StartContainerWrapper = () => {
    const progress = useSelector(state => state.gameFieldSetup.settingProgress);
    const tableState = useSelector(state => state.gameFieldSetup.tableState);
    const finishButton = !progressArray[progress];

    const onButtonHandler = () => {
        console.log(tableState);
    }

    return (
        <StartContainer>
            {
                finishButton && <button onClick={onButtonHandler}>Start!</button>
            }
            <Ship size={progressArray[progress]} id={progress}/>
        </StartContainer>
    )
}