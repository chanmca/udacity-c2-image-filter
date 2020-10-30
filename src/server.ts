import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET filteredimage endpoint
  app.get( "/filteredimage", async ( req, res ) => {
    const image_url = req.params.image_url;
    //validate the image_url query
    if (!image_url) { 
      return res.send(500).send({ message: 'image_url is must, but not found' });
    }

    if (!image_url.match('(jpg|jpeg|gif|png)((\?.*)$|$)')) {
      return res.send(500).send({ message: 'not a valid image_url is must' });
    }
    //call filterImageFromURL(image_url) to filter the image
    const filteredpath = await filterImageFromURL(image_url);
    console.log(filteredpath);
    //send the resulting file in the response
    return res.status(200).sendFile(filteredpath);
  });
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();