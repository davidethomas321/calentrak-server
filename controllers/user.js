const Express = require("express");
const router = Express.Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const validateJWT = require('../middleware/validate-jwt');

//CREATE USER : COMPLETE
router.post("/register", async (req, res) => {

    let {
        fullName,
        email, 
        password,
        favThing,
        isAdmin
    } = req.body.user;

    try {
        const User = await UserModel.create({
            fullName,
            email, 
            password: bcrypt.hashSync(password, 12),
            favThing,
            isAdmin
        });

        let token = jwt.sign({idNumber: User.idNumber}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

        res.status(201).json({
            message: 'User successfully registered',
            user: User,
            sessionToken: token
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `${err}: Failed to register user`,
        });
    }

});

//USER LOGIN : COMPLETE
router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;

    try {
        const userLogin = await UserModel.findOne({
        where: {
            email: email,
        },
        });

        if (userLogin) {

            let passwordComparison = await bcrypt.compare(password, userLogin.password);

            if (passwordComparison) {

                let token = jwt.sign({idNumber: userLogin.idNumber}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

                res.status(200).json({
                    user: userLogin,
                    message:"User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password"
                })
            }
            
        } else {
            res.status(401).json({
                message: "Incorrect username or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

//UPDATE PASSWORD: COMPLETE
router.put("/updatePassword", validateJWT, async (req, res)=> {
    const { email, password, favThing} = req.body.user;

    UserModel.update({ 
        password:bcrypt.hashSync(password, 12)
    }, {
        where: {
            email:email,
            favThing:favThing
        }
    })
    .then(updatePassword => res.status(200).json(updatePassword))
    .catch(err => res.status(500).json({
        error: err
    }))
});

//DELETE USER (ADMIN)
router.delete("/deleteUser/:id", validateJWT, async (req, res) => {
    
    try{
        const query = {
            where: {
                idNumber: req.params.id,
            }
        };

        await UserModel.destroy(query);
        res.status(200).json({message: "User Deleted"});
    } catch (err) {
        res.status(500).json({error:err});
    }
});

//GET ALL USERS (ADMIN)
router.get("/allUsers", async (req, res) => {
    try {
        const allUsers = await UserModel.findAll();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;