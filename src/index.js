const http = require("http");
const app = require("./app/app");
const appConfig = require("./config/app.config");
const connectDB = require("./config/db.config");

const server = http.createServer(app);

function init() {
  try {
    connectDB().then(() => {
      server.listen(appConfig.port, () =>
        console.log(`server is running on port number ${appConfig.port}`)
      );
    });
  } catch (error) {
    process.exit(-1);
  }
}

init();
