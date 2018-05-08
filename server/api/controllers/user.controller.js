import User from '../models/user.model';
import ROLES from '../constants/role';

export function create (req, res, next) {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    if (req.user.role === ROLES.ADMIN && req.body.role) {
        user.role = req.body.role;
    }

    user.save()
  .then((newUser) => {
      res.json(newUser);
  })
  .catch(next);
}

export function update (req, res, next) {
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

    req.userModel.save()
  .then((updatedUser) => {
      res.json(updatedUser);
  })
  .catch(next);
}

export function read (req, res) {
    res.json(req.userModel);
}

export function list (req, res, next) {
    let where = {};
    if (req.user.role === ROLES.MANAGER) {
        where = { role: { $ne: ROLES.ADMIN } };
    }

    User.find(where)
  .then((users) => {
      res.json(users);
  })
  .catch(next);
}

export function remove (req, res, next) {
    req.userModel.remove(() => {
        res.json(req.userModel);
    })
  .catch(next);
}

export function getUserByID (req, res, next, id) {
    User.findById(id)
    .then((user) => {
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.userModel = user;
        next();
    })
  .catch(next);
}

export function getProfile (req, res, next) {
    User.findById(req.user._id)
    .then((user) => {
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.userModel = user;
        next();
    })
  .catch(next);
}
