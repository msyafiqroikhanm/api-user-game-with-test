const router = require("express").Router();
const GameController = require("../controllers/GameController.js");
const AuthController = require("../controllers/AuthController.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const userRoutes = require("../routes/user.routes");

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.post("/login", AuthController.login);

router.use(AuthController.authorization);

router.use("/users", userRoutes);

router.get("/histories", GameController.getHistories);

module.exports = router;
