import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { StartContainerWrapper } from './components/StartContainerWrapper/StartContainerWrapper';
import { Board } from "./components/Board/Board";
import { isTouchScreen } from "./functions/checkTouchScreen";

export const MainFieldSetup = () => {

    const backend = (isTouchScreen()) ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={backend}>
            <div className="App">
                <StartContainerWrapper />
                <Board />    
            </div>
        </DndProvider>
  );
}