/* eslint consistent-return:0 */

import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import jwt from 'jsonwebtoken';
import { Client } from 'postmark';
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

const forgot = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        .select('_id password email firstName lastName role')
        .exec();
        if (!user) {
            res.json({ message: 'Email Sent' });
            return;
        }

        const password = Math.random().toString(36).substring(2, 10);
        user.password = password;
        await user.save();
        const templatePath = path.resolve(__dirname, '../../emails/forgot.ejs');
        const template = fs.readFileSync(templatePath, 'utf8');
        const textBody = ejs.render(template, { text: `your password is ${password}` });
        const client = new Client(config.EMAIL_API_TOKEN);

        await client.sendEmail({
            From: config.SENDER_EMAIL,
            To: user.email,
            Subject: 'New Password',
            TextBody: textBody
        });

        res.json({ message: 'Email Sent' });
    }
    catch (e) {
        console.log(e); //eslint-disable-line
        res.json({ message: 'Email Sent' });
    }
};

export {
    signup,
    login,
    forgot
};
