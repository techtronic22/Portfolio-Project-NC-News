const express = require("express");
const {
	getAllTopics,
	getAllEndpoints,
  getAllArticles,
	getArticleById,
  getCommentsById,
  postComments,
  patchArticleById,
  removeComment
} = require("./controller");


const { handlePsqlErrors, handleErrors } = require("./error-handler");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById )
app.get("/api/articles", getAllArticles )
app.post("/api/articles/:article_id/comments", postComments)
app.patch("/api/articles/:article_id", patchArticleById)
app.delete("/api/comments/:comment_id", removeComment)

app.use(handlePsqlErrors)
app.use(handleErrors)



app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found" });
});


module.exports = app;
