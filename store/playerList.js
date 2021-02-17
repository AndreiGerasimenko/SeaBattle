const sortOnline = require("../functions/onlineUser");
const { getAllUsersFromDB } = require("./usersList");

const playerList = new Map();
const addPlayer = (userId, ws) => {
    playerList.set(userId, ws); 
}
const deletePlayer = (userId) => {
    playerList.delete(userId);
}


const broadcastPlayerList = (ws) => {
    const usersCandidates = getAllUsersFromDB();
    const usersArrayToSend = sortOnline(usersCandidates, Array.from(playerList.entries()));
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