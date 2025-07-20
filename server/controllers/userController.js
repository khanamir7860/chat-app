import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs'
// sign up
export const signup = async (req, res) =>{
    const {fullName, email, password,bio } = req.body;
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({
                success:false,
                message:"Please fill all the fields"
            })
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success:false,
                message:"User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });
        await newUser.save();


        const token = generateToken(newUser._id);
      
        return res.json({
            success:true,
            message:"User created successfully",
            userData:newUser,
            token

        })
    } catch (error) {
        return res.json({
            success:false,
            message:"Internal server error",
        })
    }

}


// user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = generateToken(existingUser._id);

        return res.json({
            success: true,
            message: "Login successful",
            userData: existingUser,
            token
        })
    } catch (error) {
        console.error("Login error:", error);
        return res.json({
            success: false,
            message: "Internal server error",
        })
    }
}

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
        return res.json({
            success: true,
            message: "User is authenticated",
            user: req.user

        })

}

// controller to update uer profile details
export const updateProfile = async (req, res) => {


    try {
           const {profilePic, fullName, bio } = req.body;
    const userId = req.user._id;

        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {
                fullName,bio
        },{new:true});
    }
    else{
        const upload = await cloudinary.uploader.upload(profilePic);
        updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
            bio,
            profilePic: upload.secure_url
        }, { new: true });
    }

    res.json({
        success:true,
        user:updatedUser
    })
    } catch (error) {
        console.error("Update profile error:", error);
        return res.json({
            success: false,
            message: "Internal server error",
        })
    }
}