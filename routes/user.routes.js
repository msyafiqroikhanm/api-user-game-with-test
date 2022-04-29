const router = require("express").Router();
const GameController = require("../controllers/GameController.js");
const { body, check } = require("express-validator");
const { user_game } = require("../models");

router.get("/", GameController.getUsers);
router.post(
  "/",
  [
    body("username").notEmpty(),
    body("password").notEmpty(),
    body("nickname").notEmpty(),
    check("email", "Email Not Valid").isEmail(),
    check("mobile_no", "Mobile Number is Not valid").isMobilePhone("id-ID"),
  ],
  GameController.addUser
);
router.get("/:id", GameController.getUserById);
router.put(
  "/:id",
  (req, res, next) => {
    try {
      user_game
        .findOne({ where: { id: req.user.id } })
        .then((user) => {
          let valid = Number(req.params.id) === req.user.id;
          if (!valid) {
            next({
              status: 401,
              message: "Unauthorized Request",
            });
          } else {
            next();
          }
        })
        .catch((err) => {
          throw {
            status: 401,
            message: "Unauthorized Request",
            err,
          };
        });
    } catch (error) {
      next(error);
    }
  },
  GameController.updateUser
);
router.delete("/:id", GameController.deleteUser);

module.exports = router;
