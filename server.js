const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const passport = require("passport");
const session = require("express-session");
const BnetStrategy = require("passport-bnet").Strategy;

passport.use(
  new BnetStrategy(
    {
      clientID: "ea0acb5a8140429a8c822a30e43f8841",
      clientSecret: "ArtQ8mm0qAwai7FtNBwcUFP941iFrdOS",
      callbackURL:
        "https://variation-roster-helper.herokuapp.com/auth/bnet/callback",
      region: "eu"
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();

app.use(cors());
app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/api/isLoggedIn", async (req, res) => {
  res.send(!!(req.user && req.user.accessToken));
});

app.get("/api/getGuildData", async (req, res) => {
  const accessKey =
    (req.user && req.user.accessToken) || process.env.ACCESS_KEY;
  const data = await axios.get(
    `https://eu.api.blizzard.com/wow/guild/Archimonde/Variation?fields=members&locale=fr_FR&access_token=${accessKey}`
  );
  res.send(data.data);
});

app.get("/auth/bnet", passport.authenticate("bnet"));

app.get(
  "/auth/bnet/callback",
  passport.authenticate("bnet", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/error", (req, res) => res.send("error"));

app.listen(process.env.PORT || 8080, () => {
  console.log("listening now", Date.now());
});
