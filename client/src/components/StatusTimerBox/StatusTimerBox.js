import React from 'react';
import './statusTimerBox.css'

export const StatusTimerBox = ({ isYourTurn }) => {

    const status = isYourTurn ? 'Your turn' : 'Opponents turn'; 

    return (
        <div className="statusBox-container">
            { status }
        </div>
    )
}