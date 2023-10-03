const express = require("express");
const {
	getAllTopics,
	getAllEndpoints,
	getArticleById,
} = require("./controller");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);

// Error Handling
app.use((err, req, res, next) => {
	console.log(err);
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		res.status(500).send({ msg: "Internal Server Error" }); // Default error response
	}
});

app.all("*", (req, res) => {
	res.status(404).send({ msg: "Invalid Path" });
});

module.exports = app;
