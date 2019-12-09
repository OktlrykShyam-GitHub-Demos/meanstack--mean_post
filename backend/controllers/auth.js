const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "User Created",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "User Exists"
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Internal Application Failure"
      });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        //user not found
        return res.status(401).json({
          message: "Auth Failed: No Such User"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        //password not matched
        return res.status(401).json({
          message: "Auth Failed: Password Invalid"
        });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        secret - TODO - gen,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: "Internal Application Failure"
      });
    });
};
