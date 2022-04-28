const jwt = require("jsonwebtoken");
const { user_game, user_game_biodata } = require("../models");
const bcrypt = require("bcryptjs");
class AuthController {
  static async login(req, res, next) {
    // #swagger.tags = ['Authentication']
    // #swagger.summary = 'Access to API'
    /* #swagger.responses[200] = {
            description: 'OK',
            schema: {
                        "message": "Login Successfully",
                        "accessToken": "[your token]"
                    }
    } */
    /* #swagger.responses[401] = {
            description: 'Error: Unauthorized',
            schema: {
                        "message": "Invalid Username Or Password",
                    }
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */

    try {
      const user = await user_game.findOne({
        where: { username: req.body.username },
      });
      if (!user) {
        throw {
          status: 401,
          message: "Invalid Username Or Password",
        };
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        throw {
          status: 401,
          message: "Invalid Username Or Password",
        };
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        "secret",
        { expiresIn: 86400 }
      );
      res
        .status(200)
        .json({ message: "Login Successfully", accessToken: token });
    } catch (error) {
      next(error);
    }
  }

  static async authorization(req, res, next) {
    /* #swagger.responses[401] = {
            description: 'Error: Unauthorized',
            schema: {
                        "message": "Unauthorized : Your Token is Invalid",
                    }
    } */

    try {
      if (!req.headers.authorization) {
        throw {
          status: 401,
          message: "Unauthorized",
        };
      }
      jwt.verify(req.headers.authorization, "secret", function (err, decoded) {
        if (err) {
          throw {
            status: 401,
            message: "Unauthorized : Your Token is Invalid",
            err,
          };
        }
        req.user = decoded;
        next();
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
