const { default: mongoose } = require("mongoose");
const { CreateCampaign, loginUser } = require("../models/details");
const multer = require("multer");
const url = require("url");
const addcampaign = async (req, res) => {
  const post = req.body;
  console.log(post);
  const finalPost = { ...post, CreatedBYId: req.userId };
  console.log(finalPost);
  const newPost = new CreateCampaign(finalPost);
  try {
    await newPost.save();
    res.status(201).json({ newPost });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const UpdateCampaign = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ msg: "no post with that id" });
  }
  CreateCampaign.findByIdAndUpdate({ _id: _id }, post, { new: true })
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((error) => {
      res.status(409).json({ message: error.message });
    });
};

const DeleteCampaign = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ msg: "no post with that id" });
  }
  CreateCampaign.findByIdAndDelete({ _id: _id })
    .then((user) => {
      res.json({ message: "successfully deleted" });
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
};

const GetCampaign = async (req, res) => {
  try {
    const campaign = await CreateCampaign.find();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const GetJoinedCampaign = async (req, res) => {
  try {
    const joinedCampaign = await CreateCampaign.find({
      //CreatedBYId
      VolunteersJoined: req.userId,
    })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => {
        res.status(404).json({ message: "Not registerd to any campaign" });
      });
  } catch {
    console.log("something went wrong...");
  }
};

const UnregisteredCampaign = async (req, res) => {
  try {
    console.log(req.userId);
    CreateCampaign.find({ VolunteersJoined: { $ne: req.userId } }).then(
      (Campaign) => {
        res.status(200).json(Campaign);
      }
    );
  } catch {}
};
module.exports = {
  addcampaign,
  UpdateCampaign,
  DeleteCampaign,
  GetCampaign,
  GetJoinedCampaign,
  UnregisteredCampaign,
};
