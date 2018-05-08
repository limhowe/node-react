/* eslint consistent-return:0 */

import User from '../models/user.model';
import ROLES from '../constants/role';

const create = async (req, res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: ROLES.MANAGER
    });

    try {
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

const update = async (req, res) => {
    Object.assign(req.userModel, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });

    if (req.body.password) {
        req.userModel.password = req.body.password;
    }

    try {
        const updatedUser = await req.userModel.save();
        res.json(updatedUser);
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

const read = (req, res) => {
    return res.json(req.userModel);
};

const list = async (req, res) => {
    let where = {};
    if (req.user.role === ROLES.MANAGER) {
        where = { role: { $ne: ROLES.ADMIN } };
    }

    const users = await User.find(where);
    try {
        res.json(users);
    }
    catch (e) {
        return res.status(500).json({ message: 'Unknown Server Error' });
    }
};

const remove = async (req, res) => {
    try {
        await req.userModel.remove();
        res.json(req.userModel);
    }
    catch (e) {
        return res.status(500).json({ message: 'Unknown Server Error' });
    }
};

const getUserByID = async (req, res, next, id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.userModel = user;
        next();
    }
    catch (e) {
        return res.status(404).json({ message: 'User not found' });
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.userModel = user;
        next();
    }
    catch (e) {
        res.status(404).json({ message: 'User not found' });
    }
};

export {
    create,
    update,
    read,
    list,
    remove,
    getUserByID,
    getProfile
};
