module.exports = (usersCandidates, users) => {
    return usersCandidates.map( item => {
        const foundUser = users.find( data => data[0] == item._id)
        if(foundUser) {
            return { 
                        id: item._id, 
                        nickname: item.nickname, 
                        // status: foundUser[1].opponentId ?
                        //             "battle" :
                        //             "online" 
                        status: "online"
                    };
        } else {
            return {id: item._id, nickname: item.nickname, status: "offline" };
        }
    });
}