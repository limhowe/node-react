/* eslint consistent-return:0 */

import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/user.model';
import ROLES from '../constants/role';

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        .select('_id password email firstName lastName role')
        .exec();

        if (!user) {
            return res.status(404).json({ message: 'Account does not exist' });
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
        res.status(401).json({ message: 'Email or password does not match' });
    }
};

const signup = async (req, res) => {
    try {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: ROLES.MANAGER
        });

        user = await user.save();
        res.json(user);
    }
    catch (e) {
        switch (e.code) {
        case 11000:
            return res.status(409).json({ message: 'User with this email already exists' });
        default:
            return res.status(500).json({ message: 'Unknown Server Error' });
        }
    }
};

export {
    signup,
    login
};
