const router = require("express").Router();
const GameController = require("../controllers/GameController.js");
const { body, check } = require("express-validator");
const { findUserById } = require("../services/userGame.services");

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
  async (req, res, next) => {
    try {
      const user = await findUserById(Number(req.params.id), [
        "id",
        "user_game_biodata_id",
      ]);

      if (!user) {
        throw {
          status: 404,
          message: "User Not Found!",
        };
      } else {
        let valid = Number(req.params.id) === req.user.id;
        if (!valid) {
          next({
            status: 401,
            message: "Unauthorized Request",
          });
        } else {
          next();
        }
      }
    } catch (error) {
      next(error);
    }
  },
  GameController.updateUser
);
router.delete("/:id", GameController.deleteUser);

module.exports = router;
