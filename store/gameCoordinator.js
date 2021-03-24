const mongoose = require('mongoose');
const Game = require('../models/Game');
const processHit = require('../functions/processShot');

const gamesInProgress = new Map();

const sendMessageWs = (gameId, id, type, payload) => {
    gamesInProgress.get(gameId).get(id).ws.send(
        JSON.stringify({
            type,
            payload
        })
    )
}

const setUpTimer = (gameId, userId, opponentId) => {
    let timerId = setTimeout(function penalty() {
        const isUserIdTurn = gamesInProgress.get(gameId).get('turn') == userId;
        const nextTurn = isUserIdTurn ?
            opponentId : userId;
        gamesInProgress.get(gameId).set('turn', nextTurn);

        sendMessageWs(
            gameId,
            userId,
            "CHANGE_OPPONENTS_FIELD",
            {
                changes: [],
                turn: !isUserIdTurn
            }
        );

        sendMessageWs(
            gameId,
            opponentId,
            "CHANGE_OPPONENTS_FIELD",
            {
                changes: [],
                turn: isUserIdTurn
            }
        );
        
        timerId = setTimeout(penalty, 30000);
        gamesInProgress.get(gameId).set('timer', timerId);
    }, 30000);

    gamesInProgress.get(gameId).set('timer', timerId);
}

const saveGameDB = async (gameId, winnerId, loserId) => {
    const gameToSave = {
        _id: gameId,
        players: [winnerId, loserId],
        winner: winnerId,
        durationTurns: gamesInProgress.get(gameId).get('currentTurn'),
        time: Date.now()
    }

    await Game.updateOne({ _id: gameId }, gameToSave, { upsert: true });
}

const isEndGame = (fieldState) => {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            if(fieldState[i][j] == 0) return false;
        }
    }
    return true;
}

const startGame = ({ id, ws, opponentId }) => {

    for (let game of gamesInProgress) {       
        if(game[1].has(id)) {
            gamesInProgress.get(game[0]).get(id).ws = ws;
            return game[0]
        }
    }

    const gameId = mongoose.Types.ObjectId();
    const gameInfo = new Map();

    gameInfo.set(id, {
        ws,
        field: [],
    }).set(opponentId, {
        ws: null,
        field: [],
    }).set('turn', id).set('timer', null).set('currentTurn', 1)
    .set('gameIsGoing', false).set('isGameFinished', false);
    gamesInProgress.set(gameId, gameInfo);

    return gameId;
}

const endGame =({ gameId }) => {
    if(!gamesInProgress.get(gameId)) return;
    clearTimeout(gamesInProgress.get(gameId).get('timer'));
    gamesInProgress.delete(gameId);
}

const initField = ({ gameId, userId, fieldSetup, opponentId }) => {
    gamesInProgress.get(gameId).get(userId).field = fieldSetup;
    if(!gamesInProgress.get(gameId).get(opponentId).field.length) {
        sendMessageWs(gameId, userId, "WAITING_FOR_OPPONENT", null);
    } else {
        const turn = gamesInProgress.get(gameId).get('turn') == userId;
        sendMessageWs(gameId, userId, "GAME_START", JSON.parse(
            JSON.stringify({
                field: gamesInProgress.get(gameId).get(userId).field,
                turn
            })
        ));
        sendMessageWs(gameId, opponentId, "GAME_START", JSON.parse(
            JSON.stringify({
                field: gamesInProgress.get(gameId).get(opponentId).field,
                turn: !turn
            })
        ));

        setUpTimer(gameId, userId, opponentId);
        gamesInProgress.get(gameId).set('gameIsGoing', true);
    } 
}

const isGameGoing = (gameId) => {
    if(!gamesInProgress.get(gameId)) return false;
    return gamesInProgress.get(gameId).get('gameIsGoing');
}

const isGameFinished = (gameId) => {
    if(!gamesInProgress.get(gameId)) return false;
    return gamesInProgress.get(gameId).get('isGameFinished');
}

const makeShot = async (gameId, userId, opponentId, { x, y }) => {
    if(gamesInProgress.get(gameId).get('turn') != userId) return;
    const cellState = gamesInProgress.get(gameId).get(opponentId).field[x][y];
    if(cellState > 1) return;
    gamesInProgress.get(gameId).get(opponentId).field[x][y] = +cellState + 2;

    const changes = [{ x, y, state: +cellState + 2 }]; 

    if(cellState != 0) {
        gamesInProgress.get(gameId).set('turn', opponentId);
        gamesInProgress.get(gameId).set(
            'currentTurn',
            gamesInProgress.get(gameId).get('currentTurn') + 1
        );
    } else {
        const resultArr = 
            processHit(gamesInProgress.get(gameId).get(opponentId).field, { x, y });    
        resultArr.forEach(({ x, y, state }) => {
            gamesInProgress.get(gameId).get(opponentId).field[x][y] = state;
        })

        changes.push(...resultArr);
    }
    const turn = gamesInProgress.get(gameId).get('turn') == userId;

    sendMessageWs(
        gameId,
        userId,
        "CHANGE_OPPONENTS_FIELD",
        {
            changes,
            turn
        }
    );

    sendMessageWs(
        gameId,
        opponentId,
        "CHANGE_YOUR_FIELD",
        {
            changes,
            turn: !turn
        }
    );

    clearTimeout(gamesInProgress.get(gameId).get('timer'));
    setUpTimer(gameId, userId, opponentId);

    if(isEndGame(gamesInProgress.get(gameId).get(opponentId).field)) {
        gamesInProgress.get(gameId).set('isGameFinished', true);
        sendMessageWs(
            gameId,
            userId,
            "GAME_RESULT",
            {
                status: 'Victory!'
            }
        );

        sendMessageWs(
            gameId,
            opponentId,
            "GAME_RESULT",
            {
                status: 'Defeat!'
            }
        );
        
        await saveGameDB(gameId, userId, opponentId);
        clearTimeout(gamesInProgress.get(gameId).get('timer'));
    }

}

module.exports = {
    startGame,
    initField,
    endGame,
    isGameGoing,
    isGameFinished,
    makeShot,
    saveGameDB
}

