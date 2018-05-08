/* eslint consistent-return:0 */

import User from '../models/user.model';
import ROLES from '../constants/role';

const create = async (req, res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    if (req.user.role === ROLES.ADMIN && req.body.role) {
        user.role = req.body.role;
    }
    try {
        user = await user.save();
        res.json(user);
    }
    catch (e) {
        return res.status(500).json({ message: 'Error' });
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

    if (req.user.role === ROLES.ADMIN && req.body.role) {
        req.userModel.role = req.body.role;
    }

    try {
        const updatedUser = await req.userModel.save();
        res.json(updatedUser);
    }
    catch (e) {
        return res.status(500).json({ message: 'Error' });
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
        return res.status(500).json({ message: 'Error' });
    }
};

const remove = async (req, res) => {
    try {
        await req.userModel.remove();
        res.json(req.userModel);
    }
    catch (e) {
        return res.status(500).json({ message: 'Error' });
    }
};

const getUserByID = async (req, res, id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.userModel = user;
    }
    catch (e) {
        return res.status(404).json({ message: 'User not found' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.userModel = user;
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
