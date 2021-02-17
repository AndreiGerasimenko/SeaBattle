const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const { 
        playerList,
        addPlayer, 
        deletePlayer, 
        broadcastPlayerList
    } = require("../store/playerList");
const { setAllUsersFromDB } = require("../store/usersList");
const { addMatchRequest, confirmMatchPair, rejectMatchRequest } = require("../store/mathPairs");

const router = new Router();

router.ws('/', async (ws, req) => {
    let decodedToken = null;

    try {
        decodedToken = jwt.verify(req.query.token, config.get("jwtSecret")); 
        addPlayer(decodedToken.userId, ws);
    } catch(e) {
        return ws.close(1008, "Unauthorized user.");
    }

    ws.on('message', async message => {
        const parsedMessage = JSON.parse(message);
        switch(parsedMessage.type) {
            case "MAKE_CHALLANGE": 
                const opponentId = parsedMessage.payload;
                if(playerList.has(opponentId)) {
                    const opponentWs = playerList.get(opponentId);
                    addMatchRequest({
                        id: decodedToken.userId,
                        ws,
                        opponentId,
                        opponentWs 
                    });
                } else {
                    broadcastPlayerList(ws);
                }
                break;
            case "CHALLANGE_ACCEPTANCE": 
               await confirmMatchPair({
                   id: decodedToken.userId,
                   opponentId: parsedMessage.payload
               });
               break;
            case "CHALLANGE_REJECTION":
                rejectMatchRequest({
                    id: decodedToken.userId,
                    opponentId: parsedMessage.payload
                });
                break;
            default:
                console.log("Unknown message!");
        }
        
        console.log("Received message - ", parsedMessage);
    });

    ws.on("close", () => {
        console.log("Connection global closed");
        deletePlayer(decodedToken.userId);
        broadcastPlayerList(ws);
    });

    try {
        const usersFromDB = await User.find().select('nickname');
        setAllUsersFromDB(usersFromDB);
        broadcastPlayerList(ws);
    } catch(e) {
        return ws.close(1008, "Database error");
    }

})


module.exports = router;