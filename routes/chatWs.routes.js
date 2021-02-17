const { Router } = require("express");
const { deleteMatchPair, 
        getChatHistory, 
        sendMessage,
        addWsConnection } = require("../store/currentMatchPairs");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = new Router();

router.ws('/', async (ws, req) => {
    let decodedToken = null;
    let opponentId = null;
    let userId = null;
    
    try {
        decodedToken = jwt.verify(req.query.token, config.get("jwtSecret"));
        userId = decodedToken.userId;
        opponentId = req.query.opponentId;    
    } catch(e) {
        ws.close(1008, "Unauthorized user.");
    }

    ws.on('message', async message => {
        
        const parsedMessage = JSON.parse(message);
        console.log("Received message from chat - ", parsedMessage);

        switch(parsedMessage.type) {
            case "CHAT_MESSAGE":
                await sendMessage(userId, 
                                  opponentId, 
                                  parsedMessage.payload.message, 
                                  parsedMessage.payload.time 
                                );
                break;
            default: 
                console.log("Unknown Chat message type");
        }
    });

    ws.on("close", () => {
        console.log("Connection CHAT closed");
        deleteMatchPair({
            id: userId,
            opponentId
        });
    });

    addWsConnection(userId, ws);

    const chatHistory = await getChatHistory(userId, opponentId);

    ws.send(JSON.stringify({
        type: "CHAT_HISTORY",
        payload: chatHistory
    }));
})


module.exports = router;