require('dotenv').config()
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {}

authController.loginWithEmail = async(req, res) =>{
    try{
        const {email, password} = req.body;
        let user = await User.findOne({ email });
        if(user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) {
                //token생성
                const token = await user.generateToken();
                return res.status(200).json({ status: 'success', user, token})
            }
        }
    } catch(error) {
        res.status(400).json({status: 'fail', error: error.message});
    }   
};

authController.authenticate = async (req, res, next) =>{
    try{
        const tokenString = req.headers.authorization
        if(!tokenString) throw new Error('Token not found');
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if(error) throw new Error('invalid token');
            req.userId = payload._id;
        });
        next();
    } catch(error){
        res.status(400).json({ status: 'fail', error: error.message})
    }
};

authController.checkAdminPermission = async(req, res, next)=>{
    try{
        //token으로 어떤 customer인지 admin인지 알 수 있음 
        //위의 authenticate에서 token을 정의했기때문에 미들웨어로 설정해줄 수 있음
        const {userId} = req;
        const user = await User.findById(userId);
        if(user.level !== 'admin') throw new Error('no permission');
        next();
    } catch(error) {
        res.status(400).json({ status: 'fail', error: error.message });
    }
}

module.exports = authController;