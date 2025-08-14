# The Steps I Took to Run the App Locally:

1. Forked the [example application repository](https://github.com/workos/workos-node) to create my [public repository](https://github.com/udlern/node-example-applications.git).
2. Cloned my repository via GitHub CLI to my computer.
3. Opened repository in VS Code via the terminal using `code .`.
4. Navigated into the node-sso-example folder and installed the dependencies using `npm install`.
5. Started the server and went to `http://localhost:8000/` to begin the login flow using `npm start`.

# Additional Information:

I followed the [SSO authentication flow instructions](https://workos.com/docs/sso/guide/.introduction) to create a new SSO connection in my WorkOS dashboard, and configured the necessary code in my app to integrate the SSO connection with and the ability to sign into the app using the Test Provider. This included creating a `.env` file to add the Client ID and API Key from my WorkOS dashboard and adding my Organization ID and Redirect URI (`http://localhost:8000/callback`) into the `index.js` file.

Screen recording of successfully authenticating my user and logging into my app with my SSO connection via the Test Provider and seeing my **first and last name**, as well as the **organization name** on the first page of my app: https://drive.google.com/file/d/15Por8tA2K4gH_nfr9czCvN9FJf9gfJJV/view?usp=sharing.
