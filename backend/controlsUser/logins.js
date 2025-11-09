import user from "../models/users.js";

const getRegisUser = (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    // Jika pengguna belum login, tampilkan halaman regis
    res.render("regis", { user: req.session.user || "" });
  }
};
const postRegisUser = (req, res) => {
  const { username, password, kPassword } = req.body;
  if (password != kPassword) {
    res.status(400).json({ msg: "wrong password" });
  } else {
    user
      .create({ username: username, password: password })
      .then(() => {
        console.log("berhasil tambah");
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const getLoginUser = (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    // Jika pengguna belum login, tampilkan halaman login
    res.render("login", { user: req.session.user || "" });
  }
};

const postLoginUser = (req, res) => {
  const { username, password } = req.body;
  user
    .findOne({ where: { username: username } })
    .then((data) => {
      if (!data) {
        console.log("User not found");
        res.redirect("/login");
      } else if (data.password != password) {
        res.redirect("/login");
        console.log("Password not found");
      } else {
        req.session.user = data;
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.error("Error" + err);
    });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

export { getLoginUser, postLoginUser, logout, getRegisUser, postRegisUser };
