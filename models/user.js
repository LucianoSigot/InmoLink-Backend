import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String,
        required: function() {
            return !this.googleId;
        },
        minlength: 6 
    },
    name: {
        type: String,
        trim: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    foto: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userschema);