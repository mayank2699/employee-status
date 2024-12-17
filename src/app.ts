import express from "express";
import sequelize from "./models/index";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import errorHandlerfn from "./middleware/errorHandler";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import aiTranslatorRoutes from "./routes/aiTranslator.route";
// import graphqlUploadExpress from "graphql-upload/GraphQLUpload.mjs";
// import { AppoloServerPluginDrainHttpServer } from "apollo-server-core";
// import chatbotRoutes from "./routes/chatbot.route";
// import userFcmRoutes from "./routes/userFcm.route";
import employee from "./routes/employee.route";

const app = express();
const port = 3000;
// app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://nextjs-kit-eta.vercel.app",
  "http://localhost:8081",
  "http://192.168.x.x:8081",
];

app.use(function (req, res, next) {
  const origin = req.headers.origin;
  logger.info("origin", { origin: origin });
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "set-cookie");
  next();
});

app.options("*", function (req, res) {
  const origin = req.headers.origin;
  logger.info("options origin", { origin: origin });
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No Content
});

// const wss = new WebSocket.Server({ port: 3001 });

//payment webhook
app.use("/api");
// app.use("/api", userFcmRoutes);
// app.use("/api", chatbotRoutes);

// wss.on("connection", function connection(ws) {
//   ws.send("Welcome New Client!");

//   ws.on("message", function incoming(message) {
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
// });
//rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//app routes
app.get("/", (req, res) => {
  res.send("My World!");
});
app.use("/api", employee);

async function startServer() {
  //error handling
  app.use(errorHandlerfn);

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const error = new Error("API not found");
    next(error);
  });
  sequelize
    .sync()
    .then(() => {
      app.listen(port, () => {
        logger.info(
          `Server is running on http://localhost:${port} & for graphql use http://localhost:${port}/graphql`
        );
      });
    })
    .catch((err: Error) => {
      logger.error("Unable to connect to the database:", err);
    });
}
startServer();
