require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const port = process.env.PORT || 5500
// Install express-static-cache to improve static content loading time
const staticCache = require("express-static-cache");

const app = express();

// Serve Static Files
app.use(express.static("public"));

// Cache Static Content
app.use(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60, // Cache duration in milliseconds (1 day)
    gzip: true
}));

// Enable CORS
app.use(cors())

// Enable Helmet
app.use(helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    },
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            "style-src": ["'self'", "'unsafe-inline'",]
        }
    }
}));

// Compression
app.use(compression());

// JSON 
app.use(express.json());


app.use("/gsap", express.static("./node_modules/gsap/dist/"))
// app.use("/st", express.static("./node_modules/split-type/dist/"))



app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/static/index.html"));
})
app.get("/", (req, res) => {
    res.redirect("/home")
})


app.get("/notfound", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/static/notfound.html"));
})


// Global Error Handling Compare

app.all("*", (req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on this server`);
    err.statusCode = 404;
    next(err);
})

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const redirectPage = statusCode === 404 ? "/notfound" : "/servererror";
    res.status(statusCode).redirect(redirectPage);

})


app.listen(port, () => console.log(`Server live on port ${port}`));
