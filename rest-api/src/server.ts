import * as dotenv from "dotenv"; //bunu diger importlardan once cagirmamiz gerekiyor.

const result = dotenv.config();

if (result.error) {
  console.log("Error loading environment variables, aborting..");
  process.exit(1);
} else {
  console.log(process.env.PORT);
}

import express from "express";
import { root } from "./routes/root";
import { isInteger } from "./utils";

const app = express();

function setupExpress() {
  //http://localhost:9000/
  app.route("/").get(root); //HTTP GET REQUEST
}

function startServer() {
  const portArgv = process.argv[2];
  // const port= parseInt(portArgv);  // parse int sikinti cikarabilir bunun yerine kenin intparse functionu taninlayabilirsin.

  let port: number;

  if (process.env.PORT !== undefined) {
    port = Number(process.env.PORT);
  } else {
    port = isInteger(portArgv) ? parseInt(portArgv) : 9000;
  }

  // console.log(process.argv); // package.json filedeki tsc-watch : comment argumentlerini gosterir

  app.listen(port, () => {
    console.log(
      `HTTP REST API Server is now running at http://localhost:${port}`
    );
  });
}

setupExpress();

startServer();