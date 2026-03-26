const express = require("express");
const { createUser } = require("../constrollers/users-controller");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.json({
      message: "success",
      payload: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "failure",
      paiload: error.message,
    });
  }
});
module.exports = router;
