const mongoose = require("mongoose")
require("dotenv").config();

exports.conmnect = () =>{
    const mongoURI = process.env.MONGODB_URL || 'mongodb+srv://shresth:shresth123@cluster0.4qjqj.mongodb.net/skillverse?retryWrites=true&w=majority';
    
    mongoose.connect(mongoURI, {

    })
    .then(() => console.log("Db connected successfully"))
    .catch((error) =>  {
        console.log("DB connection failed ");
        console.error(error);
        process.exit(1);
    })
};