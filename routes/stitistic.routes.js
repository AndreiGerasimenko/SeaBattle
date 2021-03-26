const { Router } = require("express");
const Game = require("../models/Game");
const User = require("../models/User");
const router = new Router();

//api/statistic/userlist

router.post("/userlist", async (req, res) => {

    const { searchStr } = req.body;

    try {
        const foundUsers = await User.find({ nickname: { $regex: new RegExp(searchStr, "i") } })
        .select({ _id: 1, nickname: 1});
        return res.status(200).json({ foundUsers });
    } catch(e) {
        res
        .status(500)
        .json({ message: "Something went wrong, try again later." });
    }
})

router.post("/matches", async (req, res) => {

    const { opponentId } = req.body;
    const userId = req.userId;

    if(opponentId === 'All opponents') {
        try {
            const matches = await Game.find({ players: userId })
                              .populate('players', { _id: 1, nickname: 1 });
            return res.status(200).json(matches);   
        } catch(e) {
            res
            .status(500)
            .json({ message: "Something went wrong, try again later." });
        }
        
    }

    try{
        const matches = await Game.find({ players: { $all: [opponentId, userId] } })
                              .populate('players', { _id: 1, nickname: 1 });
        return res.status(200).json(matches);
    } catch(e) {
        res
        .status(500)
        .json({ message: "Something went wrong, try again later." });
    }

    
})



module.exports = router;