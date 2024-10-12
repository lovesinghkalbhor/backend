import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieparser())



// import routes
import { userRouter } from "./routes/user.routes.js"
import { tweetRouter } from './routes/tweet.routes.js';

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)


export { app }