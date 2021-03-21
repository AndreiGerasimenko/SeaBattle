import React from 'react'
import { BattleFieldCell } from '../BattleFieldCell/BattleFieldCell'
import './bfTopBar.css'

const barContent = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

export const BFTopBar = ({ cellSize }) => {
    return (
        <div 
            className="topBar-container"
            style={
                { 
                    width: `${cellSize * 11}px`,
                }
            }
        >
            {
                Array(10).fill(null).map((_, index) => {
                    return (
                        <BattleFieldCell 
                            value={1} 
                            onClickHandler={null} 
                            cellSize={cellSize} 
                            key={index}
                        >
                            { barContent[index] }
                        </BattleFieldCell>
                    )   
                })
            }
        </div>
    )
}