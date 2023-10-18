const { SchemaTypes } = require('mongoose');
const connection=require('../Base/connection');
const Schema = connection.Schema;
const studentSchema= new Schema({
    'Name':{type:SchemaTypes.String,required:true},
    'Email':{type:SchemaTypes.String,required:true,unique:true},
    'Password':{type:SchemaTypes.String,required:true},
    'Department':{type:SchemaTypes.String},
    'Task':{type:SchemaTypes.Array}
});
const studentModel= connection.model('Student',studentSchema);
module.exports = studentModel;