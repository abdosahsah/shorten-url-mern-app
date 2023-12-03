const UrlModel = require("../models/Url");
const crypto = require("crypto");

const getUrls = async (req, res) => {
  let urls;

  try {
    urls = await UrlModel.find({ user: req.user._id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "Something went wrong while retrieving Urls",
    });
  }

  return res.status(200).json({
    success: true,
    data: urls,
  });
};

const getUrl = async (req, res) => {
  let url;

  try {
    url = await UrlModel.findOne({ _id: req.params.id, user: req.user._id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "Something went wrong while retrieving Url",
    });
  }

  return res.status(200).json({
    success: true,
    data: url,
  });
};

const addUrl = async (req, res) => {
  let { title, link } = req.body;

  let url;

  try {
    const identifier = crypto.randomBytes(10).toString("hex");

    url = await UrlModel.create({
      title,
      link,
      identifier,
      user: req.user._id,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "Something went wrong while creating Url",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Url was created successfully",
    data: url,
  });
};

const updateUrl = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      errorMessage: "Data required to update the url",
    });
  }

  try {
    const url = await UrlModel.findById(req.params.id);

    if (!url) {
      return res.status(400).json({
        success: false,
        errorMessage: "Url not found",
      });
    } else {
      url.title = req.body.title;
      url.link = req.body.link;
      await url.save();

      return res.status(200).json({
        success: true,
        message: "Url was updated successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "Something went wrong while updated Url",
    });
  }
};

const deleteUrl = async (req, res) => {
  try {
    await UrlModel.findByIdAndRemove(req.params.id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: "Something went wrong while deleting Url",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Url was deleted successfully",
  });
};

const visitLink = async (req, res) => {
  let url;

  try {
    url = await UrlModel.findOne({ identifier: req.params.identifer });
  } catch (error) {
    return res.sendStatus(500);
  }

  if (!url) {
    return res.sendStatus(404);
  }

  return res.status(303).redirect(url.link);
};

module.exports = {
  getUrls,
  getUrl,
  addUrl,
  updateUrl,
  deleteUrl,
  visitLink,
};
