import React from 'react'
import { BattleField } from '../BattleField/BattleField'
import { BFTopBar } from '../BFTopBar/BFTopBar'
import { BFLeftBar } from '../BFLeftBar/BFLeftBar'
import './field.css'

export const Field = ({ fieldState, cellSize, onClick }) => {
    return (
        <div 
            className="field-container"
            style={
                { 
                    width: `${cellSize * 11 + 2}px`,
                }
            }
        >
            <BFTopBar cellSize={cellSize} />
            <BFLeftBar cellSize={cellSize}/>
            <BattleField 
                fieldState={fieldState}
                cellSize={cellSize}
                onClick={onClick}
            />
        </div>
    )
}