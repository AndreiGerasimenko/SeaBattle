import React from 'react'
import './battleField.css'
import { BattleFieldCell } from '../BattleFieldCell/BattleFieldCell'

export const BattleField = ({ fieldState, cellSize, onClick }) => {
    return (
        <div 
            className="battleField-container"
            style={
                {
                    width: `${cellSize * 10 + 2}px`
                }
            }>
            {
                fieldState?.map((row, i) => {
                    return row.map((cell, j) => {
                        return (
                            <BattleFieldCell 
                                cellSize={cellSize}
                                value={cell}
                                onClickHandler={(() => onClick?.(i, j))}
                                key={i + "" + j}
                                hoverable={!!onClick}
                            />
                        )
                    })
                })
            }
        </div>   
    )
}