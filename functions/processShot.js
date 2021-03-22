const checkAroundHit = ({ x, y }, field) => {
    const shipState = {
        destroyed: false,
        direction: null
    }

    if(
        x - 1 >=0 && field[x - 1][y] == 0 || 
        x + 1 <= 9 && field[x + 1][y] == 0
    ) {
        return shipState;
    } else if(
        x - 1 >=0 && field[x - 1][y] == 2 || 
        x + 1 <= 9 && field[x + 1][y] == 2
    ) {
        shipState.direction = 'vertical';
        return shipState;
    }

    if(
        y - 1 >=0 && field[x][y - 1] == 0 || 
        y + 1 <= 9 && field[x][y + 1] == 0 
    ) {
        return shipState;
    } else if(
        y - 1 >=0 && field[x][y - 1] == 2 || 
        y + 1 <= 9 && field[x][y + 1] == 2
    ) {
        shipState.direction = 'horizontal';
        return shipState;
    }

    shipState.destroyed = true;
    return shipState;
}

const processHit = (fieldState, { x, y }) => {
    const changes = [];
    let { destroyed, direction } = checkAroundHit({ x, y }, fieldState);
    let start = null;
    let end = null;

    if(direction === "vertical") {
        let i = x;
        while(true) {
            if(i - 1 < 0) {
                start = i;
                break;
            }            
            if(fieldState[i - 1][y] == 0) return changes;
            if(fieldState[i - 1][y] == 2) {
                i--;
                continue;
            } else {
                start = i;
                break;
            }
        }

        i = x;
        while(true) {
            if(i + 1 > 9) {
                end = i;
                break;
            }            
            if(fieldState[i + 1][y] == 0) return changes;
            if(fieldState[i + 1][y] == 2) {
                i++;
                continue;
            } else {
                end = i;
                break;
            }
        }
    }

    if(direction === "horizontal") {
        let j = y;
        while(true) {
            if(j + 1 > 9) {
                end = j;
                break;
            }            
            if(fieldState[x][j + 1] == 0) return changes;
            if(fieldState[x][j + 1] == 2) {
                j++;
                continue;
            } else {
                end = j;
                break;
            }
        }

        j = y;
        while(true) {
            if(j - 1 < 0) {
                start = j;
                break;
            }            
            if(fieldState[x][j - 1] == 0) return changes;
            if(fieldState[x][j - 1] == 2) {
                j--;
                continue;
            } else {
                start = j;
                break;
            }
        }
    }

    if(destroyed) {
        start = end = y;
        direction = 'horizontal';
    }

    if(direction === 'horizontal' && start != null && end != null) {
        for(let i = start - 1; i <= end + 1; i++) {
            if(i >= 0 && i <= 9) {
                if(x - 1 >= 0 && fieldState[x - 1][i] == 1) {
                    changes.push({ x: x - 1, y: i, state: 3 });
                }
                if(x + 1 <= 9 && fieldState[x + 1][i] == 1) {
                    changes.push({ x: x + 1, y: i, state: 3 });
                }
            }
        }

        if(start - 1 >=0 && fieldState[x][start - 1] == 1 ) {
            changes.push({ x, y: start - 1, state: 3 });
        }

        if(end + 1 <= 9 && fieldState[x][end + 1] == 1 ) {
            changes.push({ x, y: end + 1, state: 3 });
        }
    }

    if(direction === 'vertical' && start != null && end != null) {
        for(let i = start - 1; i <= end + 1; i++) {
            if(i >= 0 && i <= 9) {
                if(y - 1 >= 0 && fieldState[i][y - 1] == 1) {
                    changes.push({ x: i, y: y - 1, state: 3 });
                }

                if(y + 1 <= 9 && fieldState[i][y + 1] == 1) {
                    changes.push({ x: i, y: y + 1, state: 3 });
                }
            }
        }

        if(start - 1 >=0 && fieldState[start - 1][y] == 1 ) {
            changes.push({ x: start - 1, y, state: 3 });
        }

        if(end + 1 <= 9 && fieldState[end + 1][y] == 1 ) {
            changes.push({ x: end + 1, y, state: 3 });
        }
    }

    return changes;
}



module.exports = processHit;