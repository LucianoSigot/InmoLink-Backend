import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true },
    password: { 
        type: String,
        required: true, 
        minlength: 6 }
});

export default mongoose.model("User", userschema);