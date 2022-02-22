const Express = require("express");
const router = Express.Router();
const { ExpenseModel } = require('../models');
const validateJWT = require('../middleware/validate-jwt');
const { Op } = require('sequelize');

//ADD EXPENSE: COMPLETE
router.post("/addExpense", validateJWT, async (req, res) => {
    const { expense, amount, writeDate} = req.body.expense;
    const { idNumber } = req.user;
    const addExpense = {
        expense:expense,
        amount:amount,
        writeDate:writeDate,
        isPaid:false,
        expenseNotes:'',
        ownerId: idNumber
    }
    
    try {
        const createExpense = await ExpenseModel.create(addExpense);
        res.status(200).json(addExpense);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

//DELETE EXPENSE: COMPLETE
router.delete("/deleteExpense/:id", validateJWT, async (req, res) => {
    
    try{
        const query = {
            where: {
                idNumber: req.params.id,
            }
        };

        await ExpenseModel.destroy(query);
        res.status(200).json({message: "Expense Deleted"});
    } catch (err) {
        res.status(500).json({error:err});
    }
});

//UPDATE EXPENSE: COMPLETE
router.put("/updateExpense/:id", validateJWT, async (req, res)=> {
    const {  expense, amount, writeDate} = req.body.expense;

    ExpenseModel.update({ 
        expense:expense,
        amount:amount,
        writeDate:writeDate,
    }, {
        where: {
            idNumber: req.params.id
        }
    })
    .then(updateExpense => res.status(200).json(updateExpense))
    .catch(err => res.status(500).json({
        error: err
    }))
});

//UPDATE GOAL isDone: COMPLETE
router.put("/updateExpenseIsPaid/:id", validateJWT, async (req, res)=> {
    const { isPaid } = req.body.expense;

    ExpenseModel.update({ 
        isPaid:isPaid
    }, {
        where: {
            idNumber: req.params.id
        }
    })
    .then(updateExpenseIsPaid => res.status(200).json(updateExpenseIsPaid))
    .catch(err => res.status(500).json({
        error: err
    }))
});



//GET SINGLE DAY'S EXPENSES: COMPLETE, DATE MUST BE IN YYYY-MM-DD FORMAT
router.get("/eDaySelect/:writeDate", validateJWT, async (req, res) => {
    const { idNumber } = req.user;
    const { writeDate } = req.params;

    try {
        const eDaySelect = await ExpenseModel.findAll({
            where: {
                ownerId: idNumber,
                writeDate: writeDate
            }
        });
        res.status(200).json(eDaySelect);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//GET DATE RANGE OF EXPENSES: COMPLETE
router.get("/eRangeSelect/:writeDate1/:writeDate2", validateJWT, async (req, res) => {
    const { idNumber } = req.user;
    const startDate = req.params.writeDate1;
    const endDate = req.params.writeDate2;

    try {
        const eRangeSelect = await ExpenseModel.findAll({
            where: {
                ownerId: idNumber,
                writeDate: {[Op.between]: [startDate, endDate]}
            }
        });
        res.status(200).json(eRangeSelect);
    } catch (err) {
        res.status(500).json({error: err});
    }
});


//GET ALL EXPENSES: COMPLETE
router.get("/allExpenses", validateJWT, async (req, res) => {
    const { idNumber } = req.user;

    try {
        const allExpenses = await ExpenseModel.findAll({
            where: {
                ownerId: idNumber,
            }
        });
        res.status(200).json(allExpenses);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;