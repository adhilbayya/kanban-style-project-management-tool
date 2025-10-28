const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const app = express();
const { clerkMiddleware } = require("@clerk/express");
const dotenv = require("dotenv");

dotenv.config();

const port = 3000;
const cardRoutes = require("./routes");

// Configure CORS to allow credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

connectDB();

// Initialize Clerk middleware with secret key
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

app.use("/cards", cardRoutes);

const server = app.listen(port, () => {
  console.log("Server listening on port", port);
});

module.exports = { server, app };
