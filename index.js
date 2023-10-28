import express from "express";
import router from "./api/routes";

const app = express();

app.use(router);

app.listen(3000, () => {console.log("Server is running http://localhost:3000")});