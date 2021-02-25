module.exports = (usersCandidates, users, currentMatchesId) => {
    return usersCandidates.map( item => {
        const foundUser = users.find( data => data[0] == item._id)
        if(foundUser) {
            const index = currentMatchesId.findIndex(elem => elem == item._id);
            return { 
                        id: item._id, 
                        nickname: item.nickname, 
                        status: index == -1 ?
                                    "online" :
                                    "battle" 
                    };
        } else {
            return {id: item._id, nickname: item.nickname, status: "offline" };
        }
    });
}