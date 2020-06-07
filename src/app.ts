import express from "express";
import userRouter from './routes/user';
import bodyParser from "body-parser";
import cors from "cors"

// Create Express server
const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'))

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use("/api/user",userRouter);
export default app;