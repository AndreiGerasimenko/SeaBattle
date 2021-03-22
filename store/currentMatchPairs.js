const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const matches = [];

const findMatchIndex = (id, opponentId) => {
    const foundMatchIndex = matches.findIndex(match => {
        return (id == match.id && opponentId == match.opponentId) ||
               (opponentId == match.id && id == match.opponentId)
    });
    return foundMatchIndex;
}

const addWsConnection = (id, ws) => {
    matches.forEach(match => {
        if(match.id == id) {
            match.ws = ws;
            return;
        } else if(match.opponentId == id) {
            match.opponentWs = ws;
        }
    });
}

const addMatchPair = async ({id, nickname, opponentId, opponentNickname}) => {
    matches.push({
        id,
        nickname,
        ws: null,
        opponentId,
        opponentNickname,
        opponentWs: null
    });

    const existingRoom = await ChatRoom.findOne({ participants: { $all: [id, opponentId] } });

    if(!existingRoom) {
        const chatRoom = new ChatRoom({ 
            participants: [id, opponentId],
            conversation: []
        });

        await chatRoom.save();
    }

}

const deleteMatchPair = ({id, opponentId}) => {
    const foundMatchIndex = findMatchIndex(id, opponentId);

    if(foundMatchIndex !== -1) {
        matches.splice(foundMatchIndex, 1);
    }
}

const getChatHistory = async (id, opponentId) => {
    const conversation = await ChatRoom.findOne({ participants: { $all: [id, opponentId] } })
                                        .populate('conversationHistory')
                                        .select({ conversationHistory: 1, _id: 0 });
    return conversation.conversationHistory.slice(-100);
}

const sendMessage = async (id, opponentId, text, time) => {
    const messageToSend = {
        message: text, 
        sender: id, 
        recipient: opponentId,
        time
    };

    const message = new Message(messageToSend);

    await message.save();
    
    await ChatRoom.updateOne(
        { participants: { $all: [id, opponentId] } },
        { $push: { conversationHistory: message._id } }
    );

    const foundMatchIndex = findMatchIndex(id, opponentId);

    matches[foundMatchIndex].ws.send(
        JSON.stringify({
            type: "CHAT_MESSAGE",
            payload: messageToSend
        })
    );

    matches[foundMatchIndex].opponentWs.send(
        JSON.stringify({
            type: "CHAT_MESSAGE",
            payload: messageToSend
        })
    );
}

const closeConnection = (id, code) => {
    const matchPair = matches.find(item => {
        return item.id == id || item.opponentId == id
    }); 

    if(matchPair) {
        const wsConnection = matchPair.id == id ? 
                             matchPair.opponentWs : 
                             matchPair.ws;
        wsConnection.close(code);
    }
}

const getCurrentMatchesID = () => {
    const arrayOfId = [];
    matches.forEach(match => {
        arrayOfId.push(match.id, match.opponentId);
    }); 

    return arrayOfId;
}

module.exports = { addMatchPair, 
                   deleteMatchPair, 
                   getChatHistory, 
                   sendMessage,
                   addWsConnection,
                   getCurrentMatchesID,
                   closeConnection };