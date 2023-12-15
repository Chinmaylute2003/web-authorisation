import userModel from "../models/userSchema.js"
import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"




export const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
        if (name && email && password && confirmPassword) {
            if (password != confirmPassword) {
                res.send({ status: "Failed", message: "Password and Confirm Password not matching" })
            } else {
                const userExist = await userModel.findOne({ email: email });
                if ((userExist)) {
                    res.send({ status: "Failed", message: "User already exist" });
                } else {

                    let salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt);

                    //Generating token

                    const newUser = new userModel({ name, email, password: hashPassword, confirmPassword: hashPassword });
                    let response = await newUser.save();

                    const token = await jwt.sign({ objectID: response._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
                    res.cookie('jwt', token, {
                        httpOnly : true,
                        maxAge : 30 * 24 * 60 * 60 * 1000
                    });
                    if (response) res.send({ status: "Pass", message: "User Registered Successfully", token: token });
                }

            }
        } else {
            res.send({ status: "Failed", message: "All fields required" })
        }
    } catch (error) {
        console.log(error)
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const userExist = await userModel.findOne({ email: email });

            if (userExist) {
                const checkPassword = await bcrypt.compare(password, userExist.password);

                if (checkPassword) {
                    const token = await jwt.sign({ objectID : userExist._id}, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                    res.cookie('jwt', token, {
                        httpOnly : true,
                        maxAge : 30 * 24 * 60 * 60 * 1000
                    });
                    res.send({ status: "Pass", message: "Login Successfully!", token: token })
                }
                else {
                    res.send({ status: "Failed", message: "Invalid Credentials!" })
                }
            }
            else {
                res.send({ status: "Failed", message: "Please login first" })
            }
        } else {
            res.send({ status: "Failed", message: "All fields required" })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getUser = async (req, res) => {
    res.send({
        name : req.user.name,
        email : req.user.email
    })
}

export const logout = async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    } )
    res.send({status : "Pass", message : "User logged out"})
}