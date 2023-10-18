const bcrypt = require('bcrypt');

module.exports = {
    async hashVal ( password, salt ){
        return await bcrypt.hash( password, salt )
        .then((hash)=>{
            return hash;
        })
        .catch((Err)=>{
            return Err;
        })
    },
    async verify ( password, dbpass ){
        return bcrypt.compare( password, dbpass)
    }
}