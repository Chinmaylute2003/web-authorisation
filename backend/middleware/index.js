import express from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import userModel from "../models/userSchema.js";

export const protect = async function (req, res, next) {
    let token = req.cookies.jwt;
    try {
        if(token){
            const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
           
            const userExist = await userModel.findById({ _id: decoded.objectID }).select('-password');
           
            req.user = userExist
            next()
        }else{
            res.send({ status: 'failed', message: 'token not found' });
        }
    } catch (error) {
        console.log(error)
    }
}

