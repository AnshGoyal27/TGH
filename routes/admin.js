const express = require('express');
const { hashVal } = require('../utils/hash');
const { signup, login, addTask } = require('../DB/Operations/admin');
const studentFunctions = require('../DB/Operations/student');
const studentSignup = studentFunctions.signup;
const { assignToken, checkToken } = require('../utils/jwt');
const router = express.Router();

router.post('/signup',async (req,res)=>{
    const {email,password} = req.body;

    hashVal( password, 10 ).then((hashPass)=>{
        signup( email, hashPass ).then((row)=>{
            if(!row){
                res.status(501).json({Message:'Error Encountered at Signup DB'})
            }
            else{
                assignToken(row,'1h').then((token)=>{
                    res.status(201).json({Message:'New Login Created Successfully',Token:token})
                }).catch((err)=>{
                    res.status(501).json({Message:'Error Encountered at Token Assign'})
                })
            }
        })
    }).catch((err)=>{
        res.status(501).json({Message:'Error Encountered at Hashing'})
    })

})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;

    login( email, password ).then((row)=>{
        if(!row){
            res.status(401).json({Message:'Unauthorized Access'});
        }
        else{
            assignToken(row,'1h').then((token)=>{
                res.status(200).json({Message:'Logged in Successfully',Token:token})
            }).catch((err)=>{
                res.status(501).json({Message:'Error Encountered at Token Assign'})
            })
        }
        
    })

})

router.post('/add/student',checkToken,async(req,res)=>{
    const { name, email, department, password, tasks } = req.body;
    console.log(req.body);

    hashVal( password, 10 ).then((hashPass)=>{
        studentSignup( name, email, hashPass, tasks, department ).then((row)=>{
            if(!row){
                res.status(501).json({Message:'Error Encountered at Signup DB'})
            }
            else{
                assignToken(row,'3h').then((token)=>{
                    res.status(201).json({Message:'New Login Created Successfully',Token:token})
                }).catch((err)=>{
                    res.status(501).json({Message:'Error Encountered at Token Assign'})
                })
            } 
        })
    }).catch((err)=>{
        res.status(501).json({Message:'Error Encountered at Hashing'})
    })

})

router.put('/add/task',checkToken,async (req,res)=>{
    try{
        const {email,task} = req.body;
    const obj = JSON.parse(task)
    let myDate = obj.time;
    myDate = myDate.split("-");
    let newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
    obj.time = newDate.getTime();
    
    const id = res.locals.authorization;
    await addTask(email,obj,id).then((flag)=>{
        if(flag){
            res.status(201).json({Message:'New Task Created Successfully'})
        }
        else{
            res.status(501).json({Message:'Error Encountered at DB'})
        }
    }).catch((err)=>{
        res.status(501).json({Message:'Error Encountered'})
    })
    }
    catch(err){
        res.status(501).json({Message:'Error Encountered'})
    }
})




module.exports = router;
