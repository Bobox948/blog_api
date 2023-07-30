const User = require("../models/user");
const Post = require("../models/post");

require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.index = async (req, res, next) => {
    try {
        const posts = await Post.find();
        console.log(posts)
        jwt.verify(req.token, process.env.JWT_SECRET,(err, authData) => {
            if (err){
                res.sendStatus(403);
            } else if (posts.length === 0) {
                res.json({
                    message: "There are no posts",
                    authData: authData
                });
            } else {
                res.json({
                    message: "Posts retrieved successfully",
                    authData: authData,
                    posts: posts
                });
            }
        });
    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    jwt.sign({ user: user.id }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
            return res.status(500).json({ message: 'Could not generate token' });
        }
        res.json({ token });
    });
};

exports.signup = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });

    if (user) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword,
        admin: false
    });

    try {
        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Could not create user', error: err.message });
    }
};

exports.verifyToken = function (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1]
        req.token = bearerToken
        next();
    } else {
        res.sendStatus(403);
    }
}
