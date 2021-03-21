import React from 'react'
import classNames from 'classnames'
import './battleFieldCell.css'

const cellStatuses = ['ship-on-field', 'empty', 'ship_hit', 'empty_hit'];

export const BattleFieldCell = ({ value, onClickHandler, cellSize, children, hoverable }) => {
    const className = classNames("cell", cellStatuses[value], { 'hoverable': hoverable });
    return (
        <div 
            className={className}
            onClick={onClickHandler}
            style={
                {
                    height: `${cellSize}px`,
                    width: `${cellSize}px`,
                    fontSize: `${cellSize / 2}px`
                }
            }
        >
            { children }
        </div>
    )
}