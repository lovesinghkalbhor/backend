import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,


    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,//coudinary url string
        required: true,

    },
    coverImage: {
        type: String,//coudinary url string
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ], password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String,
    }


}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10)
    next()

})
userSchema.methods.isPasswordCorrect = async function (password) {
    console.log(password, this.password)
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        userName: this.userName,
        email: this.email,
        fullName: this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXP
    })

}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id,

    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXP
    })

}

export const User = mongoose.model('User', userSchema)