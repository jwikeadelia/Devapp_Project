const berhasil_login = (req, res, next) => {
  const user = req.session.user || "";
  if (user) {
    next();
  } else {
    res.redirect("/login");
  }
};

export default berhasil_login;
