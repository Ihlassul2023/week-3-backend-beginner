const router = require("express").Router();
const { check } = require("express-validator");
const { getAllRecipe, getMyRecipe, getRecipeById, createRecipe, updateRecipe, deleteRecipe } = require("../controllers/recipe");
const { authenticateUser } = require("../middlewares/authentication");

router
  .route("/")
  .get(getAllRecipe)
  .post(authenticateUser, check("title", "input title harus diisi").notEmpty(), check("ingredients", "input ingredients harus diisi").notEmpty(), check("category_id", "input category_id harus diisi").notEmpty(), createRecipe);
router.route("/myRecipe").get(authenticateUser, getMyRecipe);

router.route("/:id").get(getRecipeById).put(authenticateUser, updateRecipe).delete(authenticateUser, deleteRecipe);

module.exports = router;
