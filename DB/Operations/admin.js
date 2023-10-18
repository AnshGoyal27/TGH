const { verify } = require('../../utils/hash');
const adminModel = require('../Models/admin');
const studentModel = require('../Models/student')

module.exports = {
    async signup (email,password) {
        if(email && password){
            const result = await adminModel.create({'Email':email, 'Password':password}).then((result)=>{return result}).catch((err)=>{return false});
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
        return adminModel.findOne({'Email':email}).exec().then(async (doc)=>{
            const verified = await verify(password, doc.Password)
            if(verified){
                return doc._id;
            }
            return false;
        }).catch((err)=>{
            return false;
        })
    },
    async addTask ( email, task, id ){
        if(email && task && id){
            let admin;
            await adminModel.findById(id).then((doc)=>{
                admin = doc.Email
            }).catch((err)=>{
                return false;
            })
            if(admin){
                task.admin = admin;
                return await studentModel.findOne({'Email':email}).exec().then(async (doc)=>{
                    console.log(doc)
                    task.id = doc.Task.length;
                    if(!task.status){
                        if(Date.now()<=task.time){
                            task.status = "pending";
                        }
                        else{
                            task.status = "overdue"
                        }
                    }
                    const tasks = doc.Task;
                    tasks.push(task);
                    return await studentModel.findByIdAndUpdate(doc._id,{Task:tasks}).then((doc)=>{
                        return true;
                    }).catch((err)=>{
                        console.log(err);
                        return false;
                    });
                }).catch((err)=>{
                    return false;
                })
            }
            else{
                return false;
            }
            
        }
        else{
            return false;
        }
    }
}
