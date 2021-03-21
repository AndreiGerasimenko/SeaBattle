import React from 'react'
import { Field } from '../Field/Field'
import { useSelector } from 'react-redux'
import './battleFieldsContainer.css'

export const BattleFieldsContainer = ({ fieldSetup, enemyFieldState, onCellClick }) => {

  const { cellSize } = useSelector(state => state.gameFieldSetup);

  return (
    <div className="battleField-global-container">
      <Field 
        fieldState={enemyFieldState}
        cellSize={cellSize}
        onClick={onCellClick}
      />
       <Field 
        fieldState={fieldSetup}
        cellSize={cellSize}
        onClick={null}
      />
    </div>
  );
}
