import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // function isValidImageURL(url: string): boolean {
  //   console.log(url);
  //   var regex = new RegExp('/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)');
  //   console.log(regex.test(url));
  //   return regex.test(url);
  // }

  // GET filteredimage endpoint
  app.get("/filteredimage", async (req, res) => {
    const isImageURL = require('image-url-validator');
    let imageURL = req.query.image_url;
    console.log(imageURL);
    //validate the image_url query
    if (!imageURL) {
      return res.status(500).send({ message: "image_url is must, but not found" });
    }
    
    let validFlag = false;
    try {
      validFlag = await isImageURL(imageURL.toString()); 
    } catch(error) {
      console.log(console.error());
    }
    console.log('Valid Flag\t:\t',validFlag);

    if (!validFlag) {
      return res.status(500).send({ message: "not a valid image_url" });
    }
    filterImageFromURL(imageURL.toString())
      .catch((e) => {
        return res.status(400).send({ message: "Unable to filter image." });
      })
      .then((filePath) => {
        if (filePath.toString() == "error") {
          return res.status(400).send({message: "Image url is invalid" });
        }
        return res
          .on("finish", () => {
            var fileArray: string[] = [filePath.toString()];
            deleteLocalFiles(fileArray);
          })
          .status(200)
          .sendFile(filePath.toString());
      });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
