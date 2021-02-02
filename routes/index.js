var express = require("express");
const path = require("path");
var router = express.Router();
const Ad = require("../models/Ad");

router.get("/", async function (req, res, next) {
  try {
    const sort = req.query.sort;
    const limit = parseInt(req.query.limit || 10);
    const skip = parseInt(req.query.skip);
    const name = req.query.name;
    const price = parseFloat(req.query.price);
    const tags = req.query.tags;
    const state = req.query.state;
    const mnPrice = parseFloat(req.query.mnPrice || 0);
    const mxPrice = parseFloat(req.query.mxPrice || 9999999.999);

    const filters = {};
    if (name) {
      filters.name = new RegExp("^" + req.query.name);
    }
    if (price) {
      filters.price = price;
    }
    if (tags) {
      filters.tags = tags;
    }
    if (state) {
      filters.state = state;
    }

    const valueRes = await Ad.filters(
      filters,
      limit,
      sort,
      skip,
      mnPrice,
      mxPrice
    );

    if (valueRes.length === 0) {
      const error = new Error("No hay resultados de busqueda");
      error.status = 404;

      return next(error);
    }

    res.render("index", { title: "NodePOP", value: valueRes });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/img/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const valueRes = await Ad.findOne({ img: id });

    if (!valueRes) {
      const error = new Error("No image, check id");
      error.status = 404;

      return next(error);
    }

    //TODO no se puede devolver la ruta revisar __dirname ''probar''
    res.sendFile(
      path.join(
        __dirname,
        "/home/luis/Nodepop/Nodepop/public/api/",
        valueRes.img
      )
    );
  } catch (err) {
    const error = new Error(err);
    error.status = 500;
    next(error);
  }
});

module.exports = router;
