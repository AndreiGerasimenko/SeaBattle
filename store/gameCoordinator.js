const mongoose = require('mongoose');
const Game = require('../models/Game');

const gamesInProgress = new Map();

const startGame = ({ id, ws, opponentId }) => {

    for (let game of gamesInProgress) {
        if(game[1].has(id) && game[1].get(id).ws) return game[0];
        
        if(game[1].has(id) && !game[1].get(id).ws) {
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
    }).set('turn', id);
    gamesInProgress.set(gameId, gameInfo);

    return gameId;
}

const initField = ({ gameId, userId, fieldSetup }) => {
    gamesInProgress.get(gameId).get(userId).field = fieldSetup;
}

module.exports = {
    startGame,
    initField
}

