const { hashVal, verify } = require('../../utils/hash');
const studentModel = require('../Models/student');

module.exports = {
    async signup (name,email,password,tasks,department) {
        if(email && password && name){
            if(!tasks || !Array.isArray(tasks)){
                tasks = [];
            }
            if(!department){
                department = "null";
            }
            const result = await studentModel.create({'Name':name, 'Email':email, 'Password':password, 'Tasks':tasks, 'Department':department}).then((result)=>{return result}).catch((err)=>{return false});
            if(result._id){
                return result;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    },
    async login ( email, password ) {
        return studentModel.findOne({'Email':email}).exec().then(async (doc)=>{
            console.log(doc)
            const verified = await verify(password, doc.Password)
            console.log(verified)
            if(verified){
                return doc._id;
            }
            return false;
        }).catch((err)=>{
            return false;
        })
    },
    async getRecords(id){
        return studentModel.findById(id).exec().then(async (doc)=>{
            const Task = doc.Task;
            Task.forEach((obj)=>{
                if(obj.status=="pending"){
                    if(obj.time>Date.now()){
                        obj.status = "overdue";
                    }
                }
            })
            await studentModel.findByIdAndUpdate(id,{Task:Task}).exec();
            return doc.Task;
        }).catch((err)=>{
            return false;
        })
    },
    async updateStatus(id,status,tid){
        return studentModel.findById(id).exec().then(async (doc)=>{
            const Task = doc.Task;
            Task.forEach((obj)=>{
                if(obj.status=="pending"){
                    if(obj.time>Date.now()){
                        obj.status = "overdue";
                    }
                }
                if(obj.id==tid){
                    obj.status = status;
                }
            })
            await studentModel.findByIdAndUpdate(id,{Task:Task}).exec();
            return doc.Task;
        }).catch((err)=>{
            return false;
        })
    }
}
