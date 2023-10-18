const { SchemaTypes } = require('mongoose');
const connection=require('../Base/connection');
const Schema = connection.Schema;
const adminSchema= new Schema({
    'Email':{type:SchemaTypes.String,required:true,unique:true},
    'Password':{type:SchemaTypes.String,required:true}
});

const adminModel= connection.model('Admin',adminSchema);
module.exports = adminModel;