import express from "express";
import "dotenv/config";
import { errorMeddleware } from "./middlewares/error.meddleware.js";
import userRoute from "./routes/user.routes.js";
import shopRoute from "./routes/shop.routes.js";
import productRoute from "./routes/product.routes.js";
import expensesRoute from "./routes/expenses.routes.js";
import salesRoute from "./routes/sales.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("server is runing");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/expenses", expensesRoute);
app.use("/api/v1/sales", salesRoute);

app.use(errorMeddleware);

app.listen(port, () => {
  console.log("server runing on", port);
});
