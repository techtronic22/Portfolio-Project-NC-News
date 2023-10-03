const { selectAllTopics, selectArticleById, selectAllArticles } = require("./model");
const fs = require("fs/promises");

exports.getAllTopics = (req, res, next) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAllEndpoints = (req, res) => {
	return fs.readFile("endpoints.json", "utf-8").then((data) => {
		const allEndpoints = JSON.parse(data);
		res.status(200).send(allEndpoints);
	});
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
            console.log(err)
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

