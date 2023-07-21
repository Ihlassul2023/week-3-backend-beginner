const { getRecipeAllQuery, getMyRecipeQuery, getRecipeCountQuery, getMyRecipeCountQuery, getRecipeByIdQuery, postRecipeQuery, putRecipeQuery, deleteByIdQuery } = require("../models/recipeModel");
const { NotFoundError, UnauthenticatedError } = require("../error");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const { validationInput } = require("../utils/validationInput");

const getAllRecipe = async (req, res) => {
  const { search, searchBy, limit, sort } = req.query;

  let page = req.query.page || 1;
  let limiter = limit || 5;

  data = {
    search: search || "",
    searchBy: searchBy || "title",
    offset: (page - 1) * limiter,
    limit: limit || 5,
    sort: sort || "ASC",
  };
  let dataRecipe = await getRecipeAllQuery(data);
  let dataRecipeCount = await getRecipeCountQuery(data);

  let pagination = {
    totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
    totalData: parseInt(dataRecipeCount.rows[0].count),
    pageNow: parseInt(page),
  };

  if (dataRecipe.rows.length != 0) {
    res.status(StatusCodes.OK).json({ msg: "success", data: dataRecipe.rows, pagination });
  } else {
    throw new NotFoundError("data tidak ada");
  }
};
const getMyRecipe = async (req, res) => {
  const { search, searchBy, limit, sort } = req.query;
  const { id } = req.user;

  let page = req.query.page || 1;
  let limiter = limit || 5;

  data = {
    search: search || "",
    searchBy: searchBy || "title",
    offset: (page - 1) * limiter,
    limit: limit || 5,
    sort: sort || "ASC",
    id: parseInt(id),
  };
  let dataRecipe = await getMyRecipeQuery(data);
  let dataRecipeCount = await getMyRecipeCountQuery(data);

  let pagination = {
    totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
    totalData: parseInt(dataRecipeCount.rows[0].count),
    pageNow: parseInt(page),
  };

  if (dataRecipe.rows.length != 0) {
    res.status(StatusCodes.OK).json({ msg: "success", data: dataRecipe.rows, pagination });
  } else {
    throw new NotFoundError("data tidak ada");
  }
};
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  let dataRecipe = await getRecipeByIdQuery(parseInt(id));
  if (dataRecipe.rows[0]) {
    res.status(StatusCodes.OK).json({ msg: "success", data: dataRecipe.rows[0] });
  } else {
    throw new NotFoundError("data tidak ada");
  }
};
const createRecipe = async (req, res) => {
  const { title, ingredients, category_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationInput({ errors });
  }
  let data = {
    title,
    ingredients,
    category_id: parseInt(category_id),
    user_id: parseInt(req.user.id),
  };

  let result = await postRecipeQuery(data);
  console.log(result);

  return res.status(StatusCodes.CREATED).json({ msg: "success", data });
};
const updateRecipe = async (req, res) => {
  const { title, ingredients, category_id, category } = req.body;
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationInput({ errors });
  }

  let dataRecipe = await getRecipeByIdQuery(parseInt(id));
  if (!dataRecipe.rows[0]) {
    throw new NotFoundError("data tidak ada");
  }
  let data = {
    title: title || dataRecipe.rows[0].title,
    ingredients: ingredients || dataRecipe.rows[0].ingredients,
    category_id: parseInt(category_id) || dataRecipe.rows[0].category_id,
    // category: category || dataRecipe.rows[0].category,
    user_id: parseInt(req.user.id),
    id,
  };
  if (req.user.id == dataRecipe.rows[0].user_id) {
    let result = await putRecipeQuery(data);
    res.status(StatusCodes.OK).json({ msg: "berhasil terupdate" });
  } else {
    throw new UnauthenticatedError("kredensial tidak valid");
  }
};
const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  let dataRecipe = await getRecipeByIdQuery(parseInt(id));
  if (dataRecipe.rows[0]) {
    res.status(StatusCodes.OK).json({ msg: "success", data: dataRecipe.rows[0] });
  } else {
    throw new NotFoundError("data tidak ada");
  }
  if (req.user.id == dataRecipe.rows[0].user_id) {
    let result = await deleteByIdQuery(id);
    res.status(StatusCodes.OK).json({ msg: "terhapus" });
  } else {
    throw new UnauthenticatedError("kredensial tidak valid");
  }
};

module.exports = {
  getAllRecipe,
  getMyRecipe,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
