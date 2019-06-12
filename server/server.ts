import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
const cookieSession = require("cookie-session");

// We need the line below
const passportSetup = require("../config/passport-setup.ts");
const authRoutes = require("../routes/auth-routes.ts");

const { PORT = 3000 } = process.env;
const app: any = express();

// Server side rendering.
app.set("view engine", "ejs");

// All the app.use's
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// CORS
app.use(function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Sessions
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["MikeyisWinning"],
  })
);
// oAuth
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

// Production Settings
if (process.env.NODE_ENV === "production") {
  app.use(
    "/static",
    express.static(path.resolve(__dirname, "../build/static"))
  );
  app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, "../build/index.html"));
  });
  app.get("/manifest.json", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, "../build/manifest.json"));
  });
  app.get("/src/index.css", (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, "../src/index.css"));
  });
}

// Route handelers
app.get("/signup", (req: express.Request, res: express.Response) => {
  app.set("view engine", "ejs");
  res.render("../client/components/signup.ejs", { error: null });
});

app.post("/signup", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.post("/login", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/getAll", (req: express.Request, res: express.Response) => {
  res.json(res.locals);
});
app.get("/getFavorites", (req: express.Request, res: express.Response) => {
  res.json(res.locals);
});

app.post("/addFavorites", (req: express.Request, res: express.Response) => {
  res.json(res.locals);
});

// App PORT
app.listen(PORT, () => console.log(`listening on ${PORT}`));
