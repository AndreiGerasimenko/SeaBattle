import React from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { StartContainer } from '../StartContainer/StartContainer';
import { Ship } from '../Ship/Ship';

const progressArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 0];

export const StartContainerWrapper = () => {
    const progress = useSelector(state => state.gameFieldSetup.settingProgress);
    const tableState = useSelector(state => state.gameFieldSetup.tableState);
    const wsConnection = useSelector(state => state.opponent.chatConnection);
    const finishButton = !progressArray[progress];

    const onButtonHandler = () => {
        const tableStateToSend = tableState.map(row => {
            return row.map(cell => {
                return cell !== 0 ? 1 : cell;
            });
        });

        wsConnection.send(
            JSON.stringify({
                type: "FIELD_SETUP_INIT",
                payload: tableStateToSend
            })
        );
    }

    return (
        <StartContainer>
            {
                finishButton && 
                <Button 
                    onClick={onButtonHandler}
                    type="primary"
                    size="large"
                >
                    Start!
                </Button>
            }
            <Ship size={progressArray[progress]} id={progress}/>
        </StartContainer>
    )
}