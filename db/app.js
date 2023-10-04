const express = require("express");
const {
	getAllTopics,
	getAllEndpoints,
  getAllArticles,
	getArticleById,
  getCommentsById,
  postComments
} = require("./controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById )
app.get("/api/articles", getAllArticles )
app.post("/api/articles/:article_id/comments", postComments)

// Error Handling
app.use((err, req, res, next) => {
  if(err.code === '23503') {
    res.status(404).send({msg: "Username Not Found"})
  }
 if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } 
});

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});


module.exports = app;