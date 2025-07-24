function requireSignIn(req, res, next) {
  if (!req.session || !req.session.accountId) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  next();
}

module.exports = { requireSignIn };
