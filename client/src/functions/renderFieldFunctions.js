export const clearTableState = ({ x, y, size, orientation, tableState}) => {
    if(orientation === 'vertical') {
        const topBorder = y;
        const bottomBorder = y + size - 1;

        for(let i = topBorder; i <= bottomBorder; i++) {
            if(i>=0 && i<=9) {
                tableState[i][x] = 1;

                if(x - 1 >= 0) tableState[i][x - 1]--;
                if(x + 1 <= 9)  tableState[i][x + 1]--;
            }
        }

        for(let i = x - 1; i <= x + 1; i++) {
            if(i>=0 && i<=9) {
                if(topBorder - 1 >= 0) tableState[topBorder - 1][i]--;
                if(bottomBorder + 1 <= 9) tableState[bottomBorder + 1][i]--;
            }
        }

    } else {
        const leftBorder = x;
        const rightBorder = x + size - 1;

        for(let i = leftBorder; i <= rightBorder; i++ ) {
            if(i>=0 && i<=9) {
                tableState[y][i] = 1;
    
                if(y - 1 >= 0) tableState[y - 1][i]--;
                if(y + 1 <= 9)  tableState[y + 1][i]--;
            }
        }

        for(let i = y - 1; i <= y + 1; i++) {
            if(i>=0 && i<=9) {
                if(leftBorder - 1 >= 0) tableState[i][leftBorder - 1]--;
                if(rightBorder + 1 <= 9) tableState[i][rightBorder + 1]--;
            }
        }
    }
    
}

export const renderTableState = ({ x, y, size, orientation, tableState}) => {
    if(orientation === 'vertical') {
        const topBorder = y;
        const bottomBorder = y + size - 1;

        for(let i = topBorder; i <= bottomBorder; i++) {
            if(i>=0 && i<=9) {
                tableState[i][x] = 0;

                if(x - 1 >= 0) tableState[i][x - 1]++;
                if(x + 1 <= 9)  tableState[i][x + 1]++;
            }
        }

        for(let i = x - 1; i <= x + 1; i++) {
            if(i>=0 && i<=9) {
                if(topBorder - 1 >= 0) tableState[topBorder - 1][i]++;
                if(bottomBorder + 1 <= 9) tableState[bottomBorder + 1][i]++;
            }
        }

    } else {
        const leftBorder = x;
        const rightBorder = x + size - 1;

        for(let i = leftBorder; i <= rightBorder; i++ ) {
            if(i>=0 && i<=9) {
                tableState[y][i] = 0;
    
                if(y - 1 >= 0) tableState[y - 1][i]++;
                if(y + 1 <= 9)  tableState[y + 1][i]++;
            }
        }

        for(let i = y - 1; i <= y + 1; i++) {
            if(i>=0 && i<=9) {
                if(leftBorder - 1 >= 0) tableState[i][leftBorder - 1]++;
                if(rightBorder + 1 <= 9) tableState[i][rightBorder + 1]++;
            }
        }
    }
}

export const getRotateDirection = ({ orientation, x, y, size, tableState }) => {
    if(orientation === 'vertical') {
        let result = 'topCounter';

        //top counterClock-wise

        if(x + 1 <= 9 && tableState[y][x + 1] <= 2) {
            for(let i = x + 2; i <= x + size - 1; i++) {
                if(i > 9 || tableState[y][i] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        if(result) {
            return result;
        } else {
            result = 'topClock';
        }

        //top clockwise
        
        if(x - 1 >= 0 && tableState[y][x - 1] <= 2) {
            for(let i = x - size + 1; i <= x - 2; i++) {    
                if(i < 0 || tableState[y][i] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        if(result) {
            return result;
        } else {
            result = 'botClock';
        }

        //bottom clock

        if(x + 1 <= 9 && tableState[y + size - 1][x + 1] <= 2) {
            for(let i = x + 2; i <= x + size - 1; i++) {
                if(i > 9 || tableState[y + size - 1][i] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        if(result) {
            return result;
        } else {
            result = 'botCounter';
        }

        //bottom counterclock-wise

        if(x - 1 >= 0 && tableState[y + size - 1][x - 1] <= 2) {
            for(let i = x - size + 1; i <= x - 2; i++) {    
                if(i < 0 || tableState[y + size - 1][i] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        return result;

    } else {
        let result = 'leftClock';

        //left clockwise

        if(y + 1 <= 9 && tableState[y + 1][x] <= 2) {
            for(let i = y + 2; i <= y + size - 1; i++) {
                if(i > 9 || tableState[i][x] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        if(result) {
            return result;
        } else {
            result = 'leftCounter';
        }
    
        //left counter

        if(y - 1 >= 0 && tableState[y - 1][x] <= 2) {
            for(let i = y - size + 1; i <= y - 2; i++) {
                if(i < 0 || tableState[i][x] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        if(result) {
            return result;
        } else {
            result = 'rightClock';
        }

        //right clock

        if(y - 1 >= 0 && tableState[y - 1][x + size - 1] <= 2) {
            for(let i = y - size + 1; i <= y - 2; i++) {
                if(i < 0 || tableState[i][x + size - 1] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        if(result) {
            return result;
        } else {
            result = 'rightCounter';
        }

        //right counterclock-wise

        if(y + 1 <= 9 && tableState[y + 1][x + size - 1] <= 2) {
            for(let i = y + 2; i <= y + size - 1; i++) {
                if(i > 9 || tableState[i][x + size - 1] !== 1) result = false;  
            }
        } else {
            result = false;
        }

        return result;

    }
}

export const calculateNewShiphead = ({x, y, size, rotationDirection}) => {
    let newX, newY;
    switch(rotationDirection) {
        case 'topCounter':
        case 'leftClock':
            newX = x;
            newY = y;
            break;
        case 'topClock':
            newX = x - size + 1;
            newY = y;
            break;
        case 'botClock': 
            newX = x;
            newY = y + size - 1;
            break;
        case 'botCounter':
            newX = x - size + 1;
            newY = y + size - 1;
            break;
        case 'leftCounter':
            newX = x;
            newY = y - size + 1;
            break;
        case 'rightClock':
            newX = x + size - 1;
            newY = y - size + 1;
            break;
        case 'rightCounter':
            newX = x + size - 1;
            newY = y;
            break;
        default:
    }

    return { newX, newY };
}