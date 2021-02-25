const sortOnline = require("../functions/onlineUser");
const { getAllUsersFromDB } = require("./usersList");
const { getCurrentMatchesID } = require("./currentMatchPairs");

const playerList = new Map();
const addPlayer = (userId, ws) => {
    playerList.set(userId, ws); 
}
const deletePlayer = (userId) => {
    playerList.delete(userId);
}


const broadcastPlayerList = () => {
    const usersCandidates = getAllUsersFromDB();
    const currentMatchesId = getCurrentMatchesID();
    const usersArrayToSend = sortOnline(usersCandidates, Array.from(playerList.entries()), currentMatchesId);
        playerList.forEach(connection => {
            if(connection.readyState === 1) {
                connection.send(
                    JSON.stringify(
                        {
                            type: "PLAYERS_ARRAY",
                            payload: usersArrayToSend
                        }
                    )
                );
            }
        }); 
}

module.exports = { playerList, addPlayer, deletePlayer, broadcastPlayerList };