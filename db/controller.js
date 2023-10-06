const {
	selectAllTopics,
	selectAllArticles,
	selectArticleById,
	selectCommentsById,
	insertComment,
	updateArticleVote,
	deleteComment,
	selectAllUsers
} = require("./model");
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
	
	const { sort_by, order, topic } = req.query;
	selectAllArticles(sort_by, order, topic)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
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

exports.getCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsById(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postComments = (req, res, next) => {
	const newComment = req.body;
	const { article_id } = req.params;
	insertComment(newComment, article_id)
		.then((result) => {
			res.status(201).send(result );
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	updateArticleVote(article_id, inc_votes)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((err) => {
			next(err);
		});
};

exports.removeComment = (req, res, next) => {
	const {comment_id} = req.params
	deleteComment(comment_id)
	.then((response) => {
		res.status(204).send()
	})
	.catch((err) => {
		next(err)
	})
}

exports.getAllUsers = (req, res, next) => {
	selectAllUsers()
	.then((users) => {
		res.status(200).send({ users })
	})
	.catch((err) => {
		next(err)
	})

}