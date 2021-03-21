import React from 'react'
import { BattleFieldCell } from '../BattleFieldCell/BattleFieldCell'
import './bfLeftBar.css'

export const BFLeftBar = ({ cellSize }) => {
    return (
        <div 
            className="leftBar-container"
            style={
                { 
                    height: `${cellSize * 10}px`,
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
                            { index + 1 }
                        </BattleFieldCell>
                    )   
                })
            }
        </div>
    )
}