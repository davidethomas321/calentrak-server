const Express = require("express");
const router = Express.Router();
const { GoalModel } = require('../models');
const validateJWT = require('../middleware/validate-jwt');
const { Op } = require('sequelize');

//ADD GOAL: COMPLETE
router.post("/addGoal", validateJWT, async (req, res) => {
    const { goal, description, writeDate} = req.body.goal;
    const { idNumber } = req.user;
    const addGoal = {
        goal:goal,
        description:description,
        writeDate:writeDate,
        isDone: false,
        goalNotes:'',
        ownerId: idNumber
    }
    
    try {
        const createGoal = await GoalModel.create(addGoal);
        res.status(200).json(addGoal);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

//DELETE GOAL: COMPLETE
router.delete("/deleteGoal/:id", validateJWT, async (req, res) => {
    
    try{
        const query = {
            where: {
                idNumber: req.params.id,
            }
        };

        await GoalModel.destroy(query);
        res.status(200).json({message: "Goal Deleted"});
    } catch (err) {
        res.status(500).json({error:err});
    }
});

//UPDATE GOAL: COMPLETE
router.put("/updateGoal/:id", validateJWT, async (req, res)=> {
    const { goal, description, writeDate} = req.body.goal;

    GoalModel.update({ 
        goal:goal,
        description:description,
        writeDate:writeDate,
    }, {
        where: {
            idNumber: req.params.id
        }
    })
    .then(updateGoal => res.status(200).json(updateGoal))
    .catch(err => res.status(500).json({
        error: err
    }))
});

//UPDATE GOAL isDone: COMPLETE
router.put("/updateGoalisDone/:id", validateJWT, async (req, res)=> {
    const { isDone } = req.body.goal;

    GoalModel.update({ 
        isDone:isDone
    }, {
        where: {
            idNumber: req.params.id
        }
    })
    .then(updateGoal => res.status(200).json(updateGoal))
    .catch(err => res.status(500).json({
        error: err
    }))
});


//GET SINGLE DAY'S GOALS: COMPLETE, DATE MUST BE IN YYYY-MM-DD FORMAT
router.get("/gDaySelect/:writeDate", validateJWT, async (req, res) => {
    const { idNumber } = req.user;
    const { writeDate } = req.params;

    try {
        const gDaySelect = await GoalModel.findAll({
            where: {
                ownerId: idNumber,
                writeDate: writeDate
            }
        });
        res.status(200).json(gDaySelect);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//GET DATE RANGE OF GOALS
router.get("/gRangeSelect/:writeDate1/:writeDate2", validateJWT, async (req, res) => {
    const { idNumber } = req.user;
    const startDate = req.params.writeDate1;
    const endDate = req.params.writeDate2;

    try {
        const gRangeSelect = await GoalModel.findAll({
            where: {
                ownerId: idNumber,
                writeDate: {[Op.between]: [startDate, endDate]}
            }
        });
        res.status(200).json(gRangeSelect);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//GET ALL GOALS
router.get("/allGoals", validateJWT, async (req, res) => {
    const { idNumber } = req.user;

    try {
        const allGoals = await GoalModel.findAll({
            where: {
                ownerId: idNumber,
            }
        });
        res.status(200).json(allGoals);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;