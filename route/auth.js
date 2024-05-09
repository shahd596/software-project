const router = require("express").Router();
const User = require("../models/User");
const Admin = require("../models/admins");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(
      req.body.password,11
    )   //11 is number of hash rounds
  })
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  try{
    // Check if user exists
    const user = await User.findOne({ username: req.body.username }).exec();
    const isAdmin = user ? user.isAdmin : false;
    console.log(req.body);
    // If user not found, check admin
    if (!user) {
      const admin = await Admin.findOne({ username: req.body.username }).exec();
      if (!admin) {
        return res.status(401).json("Wrong Username or Password");
      } else {
        const originalPassword = admin.password;
        const inputPassword = req.body.password;

        if (!bcrypt.compareSync(inputPassword,originalPassword)) {
           return res.status(401).json("Wrong Username or Password");
        }

        const accessToken = jwt.sign(
          {
            id: admin._id,
            isAdmin: true,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        const { password, ...others } = admin._doc;  
        return res.status(200).json({ ...others, accessToken });
      }
    }
    const originalPassword = user.password

    const inputPassword = req.body.password;

    if (!bcrypt.compareSync(inputPassword,originalPassword)) {
      return res.status(401).json("Wrong Username or Password");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;  
    res.status(200).json({...others, accessToken});

  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
