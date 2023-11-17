const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imgageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "yohohohohoho";
const bucket = "r3tr0-booking-app";

const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
};

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    // origin: "https://main--world-seeker.netlify.app" || "http://localhost:3000",
    origin: "http://localhost:3000",
  })
);

async function uploadToS3(path, originalFileName, mimetype) {
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFileName.split(".");
  const ext = parts[parts.length - 1];
  const newFileName = Date.now() + "." + ext;
  const data = await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFileName,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}
app.get("/test", (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  res.json("I like ur cut G");
});

app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("wrong password");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { token } = await req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, id } = await User.findById(userData.id);
      res.json({ name, email, id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imgageDownloader.image({
    url: link,
    dest: /tmp/ + newName,
  });
  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup(/tmp/ + newName)
  );
  res.json(url);
});

const photosMiddleware = multer({ dest: "/tmp" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    email,
    price,
    phone,
  } = req.body;
  Booking.create({
    place,
    user: userData.id,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    email,
    price,
    phone,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONOG_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000, () => {
  mongoose.connect(process.env.MONOG_URL);
  console.log(`Server running on port 4000`);
});
