const User = require("../models/auth.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register = async(req,res) => {
    try{

        const  {firstName, lastName, email, password} = req.body

        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fiedls must be required!"})
        }
        
        const hashedPassword = bcrypt.hash(password, 10)

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        return res.status(200).json({ success: true, message: 'User registered successfully!'})
    }
    catch(error){
        return res.status(400).json({ success: false, message: error.message})
    }
}


const loginUser = async(req,res) => {
    try{
           const {email, password} = req.body;

             const loggedInUser = await User.find(email);
             if(!loggedInUser){
                return res.status(400).json({ success: false, message: "Invalid credentials!"})
             }

             const comparePassword = bcrypt.compare(password, loggedInUser.password)

             if(!comparePassword){
                  return res.status(400).json({ success: false, message: "Invalid credentials!"})
             }

             const token = jwt.sign({
                id: loggedInUser._id,
              
             },
)
    }
    catch(error){
        return res.status(400).json({ success: false, message: error.message})
    }
}

module.exports = {
     register,
     loginUser
}