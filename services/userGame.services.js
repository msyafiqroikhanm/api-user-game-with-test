const {
  user_game,
  user_game_biodata,
  user_game_history,
  game_activity,
} = require("../models");
const {
  createBio,
  deleteBio,
} = require("../services/userGameBiodata.services");
const { deleteHistory } = require("./userGameHistory.services");

const findAllUsers = async (attributes) => {
  const users = await user_game.findAll({
    attributes,
  });
  return users;
};

const findUserAndBioById = async (id) => {
  const user = await user_game.findOne({
    where: { id },
    attributes: ["username", "user_game_biodata_id", "createdAt", "updatedAt"],
    include: {
      model: user_game_biodata,
      as: "Biodata",
      attributes: ["nickname", "email", "mobile_no"],
    },
  });
  return user;
};

const findUserById = async (id, attributes) => {
  const user = await user_game.findOne({
    where: { id },
    attributes,
  });
  return user;
};

const createUser = async (form_user, form_bio) => {
  const bio = await createBio(form_bio);
  form_user.user_game_biodata_id = bio.id;
  const user = await user_game.create(form_user);
  return user;
};

const updateUser = async (id, form) => {
  await user_game
    .update(form, {
      where: {
        id,
      },
    })
    .catch((err) => console.log(err));
};

const deleteUser = async (userGameId, userGameBioId) => {
  await user_game.destroy({ where: { id: userGameId } });
  await deleteBio(userGameBioId);
  await deleteHistory(userGameId);
};

const checkUserBy = async (where) => {
  const result = await user_game.count({ where });
  return result;
};

module.exports = {
  findAllUsers,
  findUserAndBioById,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  checkUserBy,
};
