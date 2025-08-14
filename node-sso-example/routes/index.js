import "dotenv/config";
import express from "express";
import session from "express-session";
import { WorkOS } from "@workos-inc/node";

const app = express();
const router = express.Router();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID;
const organizationID = "org_01K2E2FC82Z790RSP2PPFHD7CF";
const redirectURI = "http://localhost:8000/callback";
const state = "";

app.get("/auth", (_req, res) => {
  // Use the Test Organization ID to get started. Replace it with
  // the user’s real organization ID when you finish the integration.
  const organization = "org_01K2E2FC82Z790RSP2PPFHD7CF";

  // The callback URI WorkOS should redirect to after the authentication
  const redirectUri = "http://localhost:8000/callback";

  const authorizationUrl = workos.sso.getAuthorizationUrl({
    organization,
    redirectUri,
    clientId,
  });

  res.redirect(authorizationUrl);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;

  const { profile } = await workos.sso.getProfileAndToken({
    code,
    clientId,
  });

  // Use the Test Organization ID to get started. Replace it with
  // the user’s real organization ID when you finish the integration.
  const organization = "org_01K2E2FC82Z790RSP2PPFHD7CF";

  // Validate that this profile belongs to the organization used for authentication
  if (profile.organizationId !== organization) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  // Use the information in `profile` for further business logic.

  res.redirect("/");
});

router.get("/", function (req, res) {
  if (session.isloggedin) {
    res.render("login_successful.ejs", {
      profile: session.profile,
      first_name: session.first_name,
      organization: session.organization,
    });
  } else {
    res.render("index.ejs", { title: "Home" });
  }
});

router.post("/login", (req, res) => {
  const login_type = req.body.login_method;

  const params = {
    clientID: clientID,
    redirectURI: redirectURI,
    state: state,
  };

  if (login_type === "saml") {
    params.organization = organizationID;
  } else {
    params.provider = login_type;
  }

  try {
    const url = workos.sso.getAuthorizationURL(params);

    res.redirect(url);
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

router.get("/callback", async (req, res) => {
  let errorMessage;
  try {
    const { code, error } = req.query;

    if (error) {
      errorMessage = `Redirect callback error: ${error}`;
    } else {
      const profile = await workos.sso.getProfileAndToken({
        code,
        clientID,
      });
      const json_profile = JSON.stringify(profile, null, 4);

      // GET call to render organization name from the organization object after profile object upon logging into app
      const organization = await workos.organizations.getOrganization(
        organizationID
      );

      session.first_name = profile.profile.first_name;
      session.profile = json_profile;
      session.organization = organization;
      session.isloggedin = true;
    }
  } catch (error) {
    errorMessage = `Error exchanging code for profile: ${error}`;
  }

  if (errorMessage) {
    res.render("error.ejs", { error: errorMessage });
  } else {
    res.redirect("/");
  }
});

router.get("/logout", async (req, res) => {
  try {
    session.first_name = null;
    session.profile = null;
    session.organization = null;
    session.isloggedin = null;

    res.redirect("/");
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

export default router;
