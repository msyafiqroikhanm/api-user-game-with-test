const {
  user_game,
  user_game_biodata,
  user_game_history,
  game_activity,
} = require("../models");

const checkBioBy = async (where) => {
  return await user_game_biodata.count({ where });
};

const createBio = async (form) => {
  return await user_game_biodata.create(form);
};

const updateBio = async (id, form) => {
  await user_game_biodata
    .update(form, {
      where: { id },
    })
    .catch((err) => console.log(err));
};

const deleteBio = async (id) => {
  console.log(id);
  user_game_biodata.destroy({
    where: { id },
  });
};
module.exports = { checkBioBy, createBio, updateBio, deleteBio };
