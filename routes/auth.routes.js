const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const tokensGeneratop = require("../functions/tokensGenerator");
const User = require("../models/User");
const router = new Router();

// /api/auth/register

router.post(
  "/register",
  [
    check("nickname", "Invalid nickname").isLength({
      min: 4,
    }),
    check("password", "The password must be at 6 characters ").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid registration data",
        });
      }
      const { nickname, password } = req.body;

      const candidate = await User.findOne({ nickname });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "The player with such nickname already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ nickname, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: "The registration is successful" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, try again later." });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("nickname", "Enter valid nickname").isLength({ min: 4 }),
    check("password", "Enter valid password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid login data",
        });
      }

      const { nickname, password } = req.body;

      const user = await User.findOne({ nickname });

      if (!user) {
        return res
          .status(400)
          .json({ message: "The user with such nickname wasn`t found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const [token, refreshToken] = tokensGeneratop(user.id);

      res.json({ token, userId: user.id, refreshToken });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, try again later." });
    }
  }
);

// /api/auth/login

router.post(
  "/refresh",
  async (req, res) => {
    try {

      const { refreshToken: refresh } = req.body;

      const decodedToken = jwt.verify(refresh, config.get("jwtSecret"));

      const [token, refreshToken] = tokensGeneratop(decodedToken.userId);

      res.json({ token, refreshToken });
    } catch (e) {
      return res.status(401).json({ message: "Unathorized user"});
    }
  }
);


module.exports = router;
