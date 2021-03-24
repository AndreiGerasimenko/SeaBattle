import React from 'react';
import { Timer } from '../Timer/Timer.component';
import './statusTimerBox.css'

export const StatusTimerBox = ({ isYourTurn }) => {

    const status = isYourTurn.turn ? 
        <Timer isYourTurn={isYourTurn}/> : 
        'Opponents turn'; 

    return (
        <div className="statusBox-container">
            { status }
        </div>
    )
}