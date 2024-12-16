const User = require("../models/Users");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.Password, 10, async (err, hashedPass) => {
      if (err) {
        return res.json({ error: err });
      }

      const existingUser = await User.findOne({ Email: req.body.Email });
      if (existingUser) {
        return res.json({
          success: false,
          message: "Email address is already in use.",
        });
      }

      const user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Password: hashedPass,
        ConfirmPassword: hashedPass,
      });

      const usersaved = await user.save();

      res.json({
        success: true,
        message: "Registration is Successfull",
        data: usersaved,
      });
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      message: "An error occurred!",
    });
  }
};

const login = (req, res, next) => {
  User.findOne({ Email: req.body.Email })
    .then((User) => {
      if (User) {
        bcrypt.compare(
          req.body.Password,
          User.Password,
          function (err, result) {
            if (err) {
              res.json({
                error: err,
              });
            } else {
              if (result) {
                let token = jwt.sign(
                  { Email: User.Email, Id: User._id },
                  "AZQ,PI)0(",
                  {
                    expiresIn: "24h",
                  }
                );

                const responseData = {
                  message: "Login Successful",
                  token: token,
                  user: User,
                };
                res.json({
                  responseData,
                });
              } else {
                res.json({
                  message: "Password does not Matched!",
                });
              }
            }
          }
        );
      } else {
        res.json({
          message: "No user Found!",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    });
};

const logout = (req, res) => {
  const token = req.header("Authorization");

  if (token) {
    blacklistedTokens.push(token);
    res.json({ message: "Logout successful" });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
};
const search = async (req, res) => {
  try {
    const { term } = req.body;

    if (!term) {
      return res
        .status(400)
        .json({ success: false, error: "Search term is required" });
    }

    const results = await Dereja.find({
      $or: [
        { Title: { $regex: term, $options: "i" } },
        { Locations: { $regex: term, $options: "i" } },
        { DateTime: { $regex: term, $options: "i" } },
        { Detail: { $regex: term, $options: "i" } },
      ],
    });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No results found" });
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
module.exports = {
  userRegister,
  login,
  logout,
  search,
};
