const checkRoles = (roles) => (req, res, next) => {
    if (roles.indexOf(req.user.role) > -1) {
        next();
        return;
    }
    res.status(401).json({ message: 'You are not authorized' });
};


export default {
    checkRoles
};
