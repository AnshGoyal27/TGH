const mongoose = require('mongoose');
const { URL } = require('./config');


try{
    mongoose.connect(URL,{maxPoolSize:5});
    console.log('Connected Successfully');
}
catch(err){
    console.log('DB Connection Error');
}

module.exports= mongoose;