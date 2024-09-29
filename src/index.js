
import 'dotenv/config';
import { connectDB } from "./db/db.js";
import { app } from './app.js';

const PORT = process.env.PORT || 8000

connectDB().then(() => {



    app.listen(PORT, () => {
        console.log("listening on port", PORT);
    });
    app.on("error", (error) => {
        console.log("Error while connectiong database")
        throw error
    });
}).catch((err) => {
    console.error(err);
});


