const {
  findAllUsers,
  findUserAndBioById,
  findUserById,
  updateUser,
  deleteUser,
  checkUserBy,
  createUser,
} = require("../services/userGame.services");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const {
  checkBioBy,
  updateBio,
} = require("../services/userGameBiodata.services");
const { findAllHistories } = require("../services/userGameHistory.services");

class GameController {
  static async getUsers(req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get All User'
    /* #swagger.responses[404] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "User Not Found!",
                    }
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */
    /* #swagger.responses[200] = {
            description: 'OK',
            schema: [
                      {
                        "username": "raptotor",
                        "createdAt": "2022-04-08T15:06:30.316Z",
                        "updatedAt": "2022-04-08T15:06:30.316Z"
                      }
                    ]
    } */
    try {
      const users = await findAllUsers(["username", "createdAt", "updatedAt"]);
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        throw {
          status: 404,
          message: "User Not Found!",
        };
      }
    } catch (error) {
      next(error);
    }
  }
  static async addUser(req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Add New User'
    /* #swagger.responses[201] = {
            description: 'Created',
            schema: {
                        "message": "User Has Been Created",
                    }
    } */
    /* #swagger.responses[400] = {
            description: 'Error: Bad Request',
            schema: {
                      "message": "Bad Request : email or username is exist"
                    }
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */
    /* #swagger.responses[400] = {
            description: 'Error: Bad Request',
            schema: {
                      "message": {
                        "errors": [
                          {
                            "value": "any",
                            "msg": "Email Not Valid",
                            "param": "email",
                            "location": "body"
                          },
                          {
                            "value": "any",
                            "msg": "Mobile Number is Not valid",
                            "param": "mobile_no",
                            "location": "body"
                          }
                        ]
                      }
                    }
    } */
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw {
          status: 400,
          message: errors,
        };
      }
      const isExist = {
        email: await checkBioBy({ email: req.body.email }),
        username: await checkUserBy({ username: req.body.username }),
      };

      if (isExist.email && isExist.username) {
        throw {
          status: 400,
          message: "Bad Request : email or username is exist",
        };
      } else {
        let mobile = req.body.mobile_no ? req.body.mobile_no : null;

        const user = await createUser(
          {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
          },
          {
            nickname: req.body.nickname,
            email: req.body.email,
            mobile_no: mobile,
          }
        );

        res.status(201).json({ message: "User Has Been Created" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Find User By ID'
    /* #swagger.responses[404] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "User Not Found!",
                    }
    } */
    /* #swagger.responses[200] = {
            description: 'OK',
            schema: {
                      "username": "raptotor",
                      "createdAt": "2022-04-08T15:06:30.316Z",
                      "updatedAt": "2022-04-08T15:06:30.316Z",
                      "Biodata": {
                        "nickname": "Rapthor98",
                        "email": "siraptorkeren@mail.com",
                        "mobile_no": "08888888812"
                      }
                    }
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */

    try {
      let selectedUser = await findUserAndBioById(Number(req.params.id));

      if (selectedUser) {
        res.status(200).json(selectedUser);
      } else {
        throw {
          status: 404,
          message: "User Not Found!",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update an exiting User'
    /* #swagger.responses[404] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "User Not Found!",
                    }
    } */
    /* #swagger.responses[200] = {
            description: 'OK',
            schema: {
                        "message": "User Has Been Updated!",
                    }
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */

    try {
      let selectedUser = await findUserAndBioById(Number(req.params.id));
      if (selectedUser) {
        const form_user = {
          password: req.body.password
            ? req.body.password
            : selectedUser.password,
        };
        const form_bio = {
          nickname: req.body.nickname
            ? req.body.nickname
            : selectedUser.Biodata.nickname,
          email: req.body.email ? req.body.email : selectedUser.Biodata.email,
          mobile_no: req.body.mobile_no
            ? req.body.mobile_no
            : selectedUser.Biodata.mobile_no,
        };
        await updateUser(Number(req.params.id), form_user);

        await updateBio(selectedUser.user_game_biodata_id, form_bio);
        res.status(200).json({ message: "User Has Been Updated!" });
      } else {
        throw {
          status: 404,
          message: "User Not Found!",
        };
      }
    } catch (error) {
      next(error);
    }
  }
  static async deleteUser(req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete a User'
    /* #swagger.responses[404] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "User Not Found!",
                    }
    } */
    /* #swagger.responses[200] = {
            description: 'OK',
            schema: {
                        "message": "User Has Been Deleted!",
                    }
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */

    try {
      let selectedUser = await findUserById(Number(req.params.id), [
        "id",
        "user_game_biodata_id",
      ]);

      if (selectedUser) {
        await deleteUser(
          Number(req.params.id),
          selectedUser.user_game_biodata_id
        );
        res.status(200).json({
          message: "User Has Been Deleted",
        });
      } else {
        throw {
          status: 404,
          message: "User Not Found!",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async getHistories(req, res, next) {
    // #swagger.tags = ['Histories']
    // #swagger.summary = 'Get all game user history'
    /* #swagger.responses[404] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "History Not Found!",
                    }
    } */
    /* #swagger.responses[200] = {
            description: 'OK',
            schema: [
                      {
                          "id": 1,
                          "createdAt": "2022-04-08T15:06:30.653Z",
                          "User": {
                              "username": "botcat"
                          },
                          "Activity": {
                              "name": "Login"
                          }
                      }
                    ]
    } */
    /* #swagger.responses[500] = {
            description: 'Error: Not Found',
            schema: {
                        "message": "Internal Server Error",
                    }
    } */
    try {
      const histories = await findAllHistories();
      if (histories.length > 0) {
        res.status(200).json(histories);
      } else {
        throw {
          status: 404,
          message: "History Not Found!",
        };
      }
    } catch (error) {
      next(error);
    }
  }
}
module.exports = GameController;
