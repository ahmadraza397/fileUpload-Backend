const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true, //create temporary files for production
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true, //create automatically upload folder if not available
  })
);

app.get("/", (req, res) => {
  res.send("Working Initial Route!");
});

app.post("/single", async (req, res) => {
  try {
    const file = req.files.file;
    console.log(file);
    //if we upload same file with same name it will overwrite it so in order prevent this situation we have to declare our own file name
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    const savePath = path.join(__dirname, "public", "uploads", fileName);
    await file.mv(savePath);
    res.status("200").send({
      status: "200",
      message: "Success",
    });
  } catch (err) {
    res.status(500).send({
      message: "Error uploading file",
    });
  }
});

app.post("/multiple", async (req, res) => {
  try {
    const files = req.files.mFile;
    console.log(files);
    //first method
    // let promises = [];
    // files.forEach((file) => {
    //   const savePath = path.join(__dirname, "public", "uploads", file.name);
    //   promises.push(file.mv(savePath));
    // });
    // await Promise.all(promises);
    // res.status(200).send({
    //   status: "200",
    //   message: "Success",
    // });
    //second method
    const promise = files.map((file) => {
      const savePath = path.join(__dirname, "public", "uploads", file.name);
      return file.mv(savePath);
    });
    await Promise.all(promise);
    res.status(200).send({
      status: "200",
      message: "Success",
      data: files.name,
    });
  } catch (err) {
    res.status(500).send({
      status: "500",
      message: "Error Uploading file",
    });
  }
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
