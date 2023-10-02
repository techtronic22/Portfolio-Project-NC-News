const express = require("express");
const {getAllTopics} = require("./controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);


// Error Handling
app.use((err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
});

module.exports = app;
