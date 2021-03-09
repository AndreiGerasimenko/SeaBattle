const { getAllUsersFromDB } = require("./usersList");
const { addMatchPair } = require("./currentMatchPairs");
const { broadcastPlayerList } = require("./playerList");

const matchRequests = [];

const addMatchRequest = ({id, ws, opponentId, opponentWs}) => {
    const timeoutId = setTimeout(() => {

        const index = matchRequests.findIndex(
                item => item.id === id && item.opponentId === opponentId
            )
        if(index !== -1) {
            matchRequests.splice(index, 1);
        } 

        try {
            ws.send(JSON.stringify({
                type: "CHALLANGE_REJECTION",
                payload: "Response time is over"
            }));
            opponentWs.send(JSON.stringify({
                type: "CHALLANGE_REJECTION",
                payload: "Response time is over"
            }));
        } catch(e) {
            console.log("Sending ERROR");
        }

        
    }, 30000);

    const allUsers = getAllUsersFromDB();
    const nickname = allUsers.find(user => user._id == id).nickname;
    const opponentNickname = allUsers.find(user => user._id == opponentId).nickname;

    try {
        opponentWs.send(JSON.stringify({
            payload: {
               text: `You have been challanged by ${nickname}`,
               id
            },
            type: "CHALLANGE_NOTIFICATION"
        }));
    
        ws.send(JSON.stringify({
            type: "CHALLANGE_IS_SENT",
            payload: "CHALLANGE_IS_SENT"
        }));

        matchRequests.push({
            id,
            nickname,
            ws,
            opponentId,
            opponentNickname,
            opponentWs,
            timeoutId
        });

    } catch(e) {
        console.log("Sending Error");
    }

    
}

const confirmMatchPair = async ({ id, opponentId }) => {
    const index = matchRequests.findIndex(
        item => item.id === opponentId && item.opponentId === id
    )

    if(index !== -1) {
        const foundMatchRequest = matchRequests[index];
    
        try {
            await addMatchPair({...foundMatchRequest});

            broadcastPlayerList();

            foundMatchRequest.ws.send(JSON.stringify({
                type: "CHALLANGE_CONFIRMATION",
                payload: {
                    opponentId: foundMatchRequest.opponentId,
                    opponentNickname: foundMatchRequest.opponentNickname
                }
            }));
            foundMatchRequest.opponentWs.send(JSON.stringify({
                type: "CHALLANGE_CONFIRMATION",
                payload: {
                    opponentId: foundMatchRequest.id,
                    opponentNickname: foundMatchRequest.nickname
                }
            }));

            

            //Finding current match request and canceling it

            try{
                const newIndex = matchRequests.findIndex(
                    item => item.id === id
                );
    
    
    
                if(newIndex !== -1) {
                    matchRequests[newIndex].opponentWs.send(JSON.stringify({
                        type: "CHALLANGE_REJECTION",
                        payload: "Opponent didn`t accept the challenge"
                    }));
    
                    clearTimeout(matchRequests[newIndex].timeoutId);
                    matchRequests.splice(newIndex, 1);
                }
            } catch(e) {
                console.log("Inner Error");
            }
            

        } catch(e) {
            console.log("Sending Error");
            foundMatchRequest.opponentWs.send(JSON.stringify({
                type: "CHALLANGE_REJECTION",
                payload: "The error occured"
            }));
        }

        clearTimeout(foundMatchRequest.timeoutId);

        matchRequests.splice(index, 1);
    }
}

const rejectMatchRequest = ({ id, opponentId }) => {
    const index = matchRequests.findIndex(
        item => item.id === opponentId && item.opponentId === id
    )

    if(index !== -1) {
        const foundMatchRequest = matchRequests[index];
        try {
            foundMatchRequest.ws.send(JSON.stringify({
                type: "CHALLANGE_REJECTION",
                payload: "Opponent didn`t accept the challenge"
            }));
        } catch(e) {
            console.log("Sending Error");
        }

        clearTimeout(foundMatchRequest.timeoutId);

        matchRequests.splice(index, 1);
    }
}

module.exports = { addMatchRequest, confirmMatchPair, rejectMatchRequest };



