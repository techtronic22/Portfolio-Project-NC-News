const express = require("express");
const {
	getAllTopics,
	getAllEndpoints,
	getArticleById,
  getAllArticles
} = require("./controller");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);

// Error Handling
app.use((err, req, res, next) => {
    if (err.status === 400) {
        res.status(400).send({ msg: "Bad Request" });
    } else if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Invalid Path" });
});


module.exports = app;