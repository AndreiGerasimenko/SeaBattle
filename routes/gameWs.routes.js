const { Router } = require("express");
const { deleteMatchPair, 
        getChatHistory, 
        sendMessage,
        addWsConnection,
        closeConnection } = require("../store/currentMatchPairs");
const { broadcastPlayerList } = require("../store/playerList");
const gameCoordinator = require("../store/gameCoordinator");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = new Router();

router.ws('/', async (ws, req) => {
    let decodedToken = null;
    let opponentId = null;
    let userId = null;
    let gameId = null;
    
    try {
        decodedToken = jwt.verify(req.query.token, config.get("jwtSecret"));
        userId = decodedToken.userId;
        opponentId = req.query.opponentId;    
    } catch(e) {
        ws.close(1008, "Unauthorized user.");
    }

    ws.on('message', async message => {
        
        const parsedMessage = JSON.parse(message);
        // console.log("Received message from chat - ", parsedMessage);

        switch(parsedMessage.type) {
            case "CHAT_MESSAGE":
                await sendMessage(userId, 
                                  opponentId, 
                                  parsedMessage.payload.message, 
                                  parsedMessage.payload.time 
                                );
                break;
            case "FIELD_SETUP_INIT": 
                gameCoordinator.initField({ 
                    gameId,
                    userId, 
                    fieldSetup: parsedMessage.payload,
                    opponentId
                });
                break;
            case "SHOT":
                gameCoordinator.makeShot(gameId, userId, opponentId, parsedMessage.payload);
                break;
            default: 
                console.log("Unknown Chat message type");
        }
    });

    ws.on("close", (code) => {
        if(code === 1001) {
            if(!gameCoordinator.isGameFinished(gameId)) {
                if(gameCoordinator.isGameGoing(gameId)) {
                    closeConnection(userId, 4000);
                } else {
                    closeConnection(userId, 4001);
                }   
            }   
        }

        console.log(`Connection CHAT closed ${userId}`, code);
        deleteMatchPair({
            id: userId,
            opponentId
        });
        gameCoordinator.endGame({ gameId });
        broadcastPlayerList();
    });

    addWsConnection(userId, ws);

    gameId = gameCoordinator.startGame({
        id: userId,
        opponentId,
        ws
    });

    const chatHistory = await getChatHistory(userId, opponentId);

    ws.send(JSON.stringify({
        type: "CHAT_HISTORY",
        payload: chatHistory
    }));
})


module.exports = router;