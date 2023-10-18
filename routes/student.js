const express = require('express');
const { hashVal } = require('../utils/hash');
const { signup, login, getRecords, updateStatus } = require('../DB/Operations/student');
const { assignToken, checkToken } = require('../utils/jwt');
const router = express.Router();

router.post('/signup',async (req,res)=>{
    const {name,email,password,tasks,department} = req.body;

    hashVal( password, 10 ).then((hashPass)=>{
        signup( name, email, hashPass, tasks, department ).then((row)=>{
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

router.post('/login',async (req,res)=>{
    const {email,password} = req.body;

    login( email, password ).then((row)=>{
        if(!row){
            res.status(401).json({Message:'Unauthorized Access'});
        }
        else{
            assignToken(row,'3h').then((token)=>{
                res.status(200).json({Message:'Logged in Successfully',Token:token})
            }).catch((err)=>{
                res.status(501).json({Message:'Error Encountered at Token Assign'})
            })
        }
        
    })
})

router.get('/tasks',checkToken,async(req,res)=>{
    const id = res.locals.authorization;
    await getRecords(id).then((record)=>{
        if(record){
            res.status(200).json({Message:'Tasks fetched',Record:record})
        }
        else{
            res.status(501).json({Message:'Error Encountered'})

        }
    })
})

router.put('/updateStatus',checkToken,async(req,res)=>{
    const id = res.locals.authorization;
    const {status,tid} = req.body;
    if(status == "completed"){
        await updateStatus(id,status,tid).then((record)=>{
            if(record){
                res.status(200).json({Message:'Tasks Updated'})
            }
            else{
                res.status(501).json({Message:'Error Encountered'})
            }
        })
    }
    else{
        res.status(501).json({Message:'Unauthorised to set this'})

    }
    
})

module.exports = router;

