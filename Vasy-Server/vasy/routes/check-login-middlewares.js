// 로그인 상태일 경우
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('need login');
    }
};

// 로그인 상태가 아닐 경우
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send(`can't access`);
    }
};