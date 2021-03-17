import { initialFieldState } from '../redux/gameFieldSetup.reducer'
import { 
    setTableState,
    setHoverState,
    nextSettingStage,
    setVisualState,
    setCellSize
} from '../redux/actions'


export const discardFieldChanges = () => {
    const arrayOfActions = [];
    arrayOfActions.push(
        setTableState(initialFieldState.tableState),
        setHoverState(initialFieldState.hoverState),
        nextSettingStage(initialFieldState.settingProgress),
        setVisualState(),
        setCellSize(initialFieldState.cellSize)
    )

    return arrayOfActions;
}