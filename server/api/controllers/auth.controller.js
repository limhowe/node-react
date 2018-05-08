/* eslint consistent-return:0 */

import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/user.model';

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        .select('_id password email firstName lastName role')
        .exec();

        if (!user) {
            return res.status(500).json({ message: 'Email or password does not match' });
        }

        await user.authenticate(req.body.password);
        const token = jwt.sign({
            _id: user._id, // eslint-disable-line
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }, config.jwtSecret, { expiresIn: config.jwtExpires });

        res.json({
            _id: user._id, // eslint-disable-line
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token
        });
    }
    catch (e) {
        res.status(500).json({ message: 'Email or password does not match' });
    }
};

const signup = async (req, res) => {
    try {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(422).json(e);
    }
};

export {
    signup,
    login
};
