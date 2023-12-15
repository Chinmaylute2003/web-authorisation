import mongoose from "mongoose";

const connectDB = async (URL, data = {
    dbName: "authDB"
}) => {
    try {
    
        let res = await mongoose.connect(URL, data);
        if(res) console.log('Successfully connected!');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;
