const mongoose = require('mongoose');
const Game = require('../models/Game');

const gamesInProgress = new Map();

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
        timer: null
    }).set(opponentId, {
        ws: null,
        field: [],
        timer: null
    }).set('turn', id).set('gameIsGoing', false);
    gamesInProgress.set(gameId, gameInfo);

    return gameId;
}

const endGame =({ gameId }) => {
    gamesInProgress.delete(gameId);
}

const initField = ({ gameId, userId, fieldSetup, opponentId }) => {
    gamesInProgress.get(gameId).get(userId).field = fieldSetup;
    if(!gamesInProgress.get(gameId).get(opponentId).field.length) {
        gamesInProgress.get(gameId).get(userId).ws.send(
            JSON.stringify({
                type: "WAITING_FOR_OPPONENT",
            })
        )
    } else {
        gamesInProgress.get(gameId).get(userId).ws.send(
            JSON.stringify({
                type: "GAME_START",
                payload: JSON.parse(
                    JSON.stringify(gamesInProgress.get(gameId).get(userId).field)
                )
            })
        );
        gamesInProgress.get(gameId).get(opponentId).ws.send(
            JSON.stringify({
                type: "GAME_START",
                payload: JSON.parse(
                    JSON.stringify(gamesInProgress.get(gameId).get(opponentId).field)
                )
            })
        )

        gamesInProgress.get(gameId).set('gameIsGoing', true);
    } 
}

const isGameGoing = (gameId) => {
    if(!gamesInProgress.get(gameId)) return false;
    return gamesInProgress.get(gameId).get('gameIsGoing');
}

module.exports = {
    startGame,
    initField,
    endGame,
    isGameGoing
}

