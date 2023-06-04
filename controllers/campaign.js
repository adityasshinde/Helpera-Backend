const { default: mongoose } = require("mongoose");
const { CreateCampaign, loginUser } = require("../models/details");
const multer = require("multer");
const url = require("url");
const moment = require("moment");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dvbkkyuso",
  api_key: "373452323229221",
  api_secret: "aIyjinhb8eG2pWkKduB0ldSQlKg",
});

const addcampaign = async (req, res) => {
  const post = req.body;
  const { startDate, endDate } = req.body;
  const sdate = startDate.split("-");
  const edate = endDate.split("-");
  let datedifference = Math.abs(edate[0] - sdate[0]);
  let monthdifference = Math.abs(edate[1] - sdate[1]);
  let yeardifference = Math.abs(edate[2] - sdate[2]);
  console.log(post);
  const finalPost = { ...post, CreatedBYId: req.userId };
  console.log(finalPost);
  const newPost = new CreateCampaign(finalPost);
  try {
    if (yeardifference == 0 && monthdifference >= 0 && datedifference >= 1) {
      await newPost.save();
      res.status(201).json({ newPost });
    } else {
      res.status(409).json({ message: "invalid dates are given" });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const uploadCampaignImage = async (req, res) => {
  let dataEntry = {
    asset_id: "",
    public_id: "",
    url: "",
  };
  const filePath = req.body.filePath;
  const ext = filePath.slice(-3);
  if (
    ext == "png" ||
    ext == "jpg" ||
    ext == "jpeg" ||
    ext == "gif" ||
    ext == "svg"
  ) {
    response = cloudinary.uploader.upload(filePath).then((data) => {
      dataEntry.asset_id = data.asset_id;
      dataEntry.public_id = data.public_id;
      dataEntry.url = data.secure_url;
      const cID = req.body.campaignId;
      CreateCampaign.findByIdAndUpdate(
        { _id: cID },
        {
          image_asset_id: dataEntry.asset_id,
          image_public_id: dataEntry.public_id,
          image_url: dataEntry.url,
        },
        { new: true }
      );
      return res.status(200).json({ message: "Image Uploaded Successfully" });
    });
  } else {
    return res.status(403).json({ message: "Invalid File Type" });
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

function check(id, ar) {
  for (let i = 0; i < ar.length; i++) {
    if (ar[i] == id) return true;
  }
  return false;
}

const joinCampaign = async (req, res) => {
  const uID = req.userId;
  const cID = req.body.campaignId;
  await CreateCampaign.findById(cID).then((campaign) => {
    let noVolunteer = campaign.VoluntersNeeded;
    if (noVolunteer <= 0) {
      return res.status(403).json({ message: "No More volunteer needed" });
    } else {
      let ar = campaign.VolunteersJoined;
      if (check(uID, ar))
        return res.status(403).json({ message: "Already Joined" });
      noVolunteer = noVolunteer - 1;
      ar.push(uID);
      CreateCampaign.findByIdAndUpdate(
        { _id: cID },
        { VoluntersNeeded: noVolunteer, VolunteersJoined: ar },
        { new: true }
      ).then(() => {
        res.status(200).json({ message: "Volunteer added in campaign" });
      });
    }
    loginUser.findById(uID).then((Volunteer) => {
      let ar = Volunteer.campaigns;
      ar.push(cID);
      loginUser
        .findByIdAndUpdate({ _id: uID }, { campaigns: ar }, { new: true })
        .then(() => {
          // res.status(200).json({ message: "Volunteer Joined" });
          // dont do anything here
        });
    });
  });
};

const SearchCampaign = async (req, res) => {
  const searchTerm = req.query.search;
  try {
    // Find campaigns that match the search term
    await CreateCampaign.find({
      CampaignName: { $regex: searchTerm, $options: "i" },
    }).then((campaign) => {
      res.status(201).json(campaign);
    });
  } catch (err) {
    console.error("Error finding campaigns:", err);
    res.status(500).send("Internal Server Error");
  }
};

const SearchOrganization = async (req, res) => {
  const searchTerm = req.query.search;
  try {
    // Find campaigns that match the search term
    await CreateCampaign.find({
      OrgName: { $regex: searchTerm, $options: "i" },
    }).then((organization) => {
      res.status(201).json(organization);
    });
  } catch (err) {
    console.error("Error finding campaigns:", err);
    res.status(500).send("Internal Server Error");
  }
};

const rating = async (req, res) => {
  const uID = req.userId;
  const rating = req.body.rating;
  await loginUser.findById(uID).then((usr) => {
    let prevReviewCnt = usr.reviewCount;
    let total = usr.Total;
    total = total + rating;
    prevReviewCnt = prevReviewCnt + 1;
    let newRating = total / prevReviewCnt;
    newRating = Math.floor(newRating);
    loginUser
      .findByIdAndUpdate(
        { _id: uID },
        { rating: newRating, reviewCount: prevReviewCnt, Total: total },
        { new: true }
      )
      .then((user) => {
        res.status(200).json({ message: "Successfully Rated" });
      });
  });
};

const getCampaignsByCid = (req, res) => {
  const cID = req.params.campaignId;
  CreateCampaign.findById(cID).then((camp) => {
    if (camp) res.status(200).json(camp);
    else res.status(404).json({ message: "Campaign Not Found" });
  });
};

const editCampaignImage = async (req, res) => {
  const cID = req.body.campaignId;
  const filePath = req.body.filePath;
  const ext = filePath.slice(-3);
  let dataEntry = {
    url: "",
  };
  if (
    ext == "png" ||
    ext == "jpg" ||
    ext == "peg" ||
    ext == "gif" ||
    ext == "svg"
  ) {
    await CreateCampaign.findById(cID).then((camp) => {
      cloudinary.uploader
        .upload(filePath, {
          public_id: camp.image_public_id,
          asset_id: camp.image_asset_id,
        })
        .then((data) => {
          dataEntry.url = data.secure_url;
          CreateCampaign.findByIdAndUpdate(
            { _id: cID },
            { image_url: dataEntry.url },
            { new: true }
          ).then(() => {
            return res
              .status(200)
              .json({ message: "Image Uploaded Successfully" });
          });
        });
    });
  } else {
    return res.status(403).json({ message: "Invalid File Type" });
  }
};

const getCampaignByCreatorId = (req, res) => {
  const creatorID = req.userId;
  try {
    CreateCampaign.find({ CreatedBYId: creatorID })
      .then((camp) => {
        res.status(200).json(camp);
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });
  } catch {
    (error) => {
      res.status(309).json({ error });
    };
  }
};

module.exports = {
  addcampaign,
  UpdateCampaign,
  DeleteCampaign,
  GetCampaign,
  GetJoinedCampaign,
  UnregisteredCampaign,
  joinCampaign,
  SearchCampaign,
  SearchOrganization,
  rating,
  uploadCampaignImage,
  getCampaignsByCid,
  editCampaignImage,
  getCampaignByCreatorId,
};
