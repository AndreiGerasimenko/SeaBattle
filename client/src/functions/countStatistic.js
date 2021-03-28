export const countStatistic = (arr, userId) => {
    if(!arr.length) return null;

    const games = arr.length;
    const tableDataSource = [];
    let gamesWon = 0;
    let movesInWonGames = 0;

    arr.forEach(game => {
        if(userId === game.winner) {
            gamesWon++;
            movesInWonGames += +game.durationTurns;
        }

        const opponentNickname = 
            game.players.find(player => player._id !== userId).nickname;

        const objToAdd = {
            key: game._id,
            date: game.time,
            moves: game.durationTurns,
            status: userId === game.winner ? 'win' : 'lose',
            opponent: opponentNickname
        }

        tableDataSource.unshift(objToAdd);

    })



    return {
        games,
        avgMoves: gamesWon ? Math.floor(movesInWonGames / gamesWon) : 0,
        winRate: Math.round((gamesWon / games) * 100),
        tableDataSource
    }
}