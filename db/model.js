const db = require("./connection");

exports.selectAllTopics = () => {
	let query = `SELECT * FROM topics`;

	return db.query(query).then((topics) => {
		if (!topics.rows.length) {
			return Promise.reject({ status: 404, msg: "Not Found" });
		}
		return topics.rows;
	});
};

exports.selectArticleById = (articleId) => {
	if (!Number(articleId)) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}

	const query = `
	  SELECT 
		author, 
		title, 
		article_id, 
		body, 
		topic, 
		created_at, 
		votes, 
		article_img_url
	  FROM articles
	  WHERE article_id = $1`;

	return db.query(query, [articleId]).then((result) => {
		if (result.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "Article not found" });
		}

		return result.rows[0];
	});
};

exports.selectAllArticles = (sort_by, order, topic) => {
	const validSorts = [
		"author_id",
		"title",
		"topic",
		"author",
		"created_at",
		"votes",
	];

	let query = `SELECT * FROM articles `;

	if (typeof topic === "string" && !isNaN(Number(topic))) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	} else if (topic !== undefined) {
		const queryTopic = `WHERE topic = $1`;
		return db.query(query + queryTopic, [topic]).then((articles) => {
			if (!articles.rows.length)
				return Promise.reject({ status: 404, msg: "Not Found" });
			return articles.rows;
		});
	}

	if (sort_by && !validSorts.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}

	if (order && order !== "asc" && order !== "desc") {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	} else if (validSorts.includes(sort_by)) {
		const querySortBy = `ORDER BY ${sort_by}`;
		return db.query(query + querySortBy).then((articles) => {
			return articles.rows;
		});
	} else if (order) {
		const queryOrderBy = `ORDER BY $1`;
		return db.query(query + queryOrderBy, [order]).then((articles) => {
			return articles.rows;
		});
	} else {
		return db
			.query(
				`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
			)
			.then((articles) => {
				let filteredArticles = articles.rows;
				filteredArticles = filteredArticles.map((article) => {
					return article;
				});
				return filteredArticles;
			});
	}
};

exports.selectCommentsById = (articleId) => {
	if (!Number(articleId)) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}

	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "Not Found" });
			}

			return db.query(
				`SELECT * FROM COMMENTS WHERE article_id = $1 ORDER BY created_at DESC`,
				[articleId]
			);
		})
		.then((comments) => {
			return comments.rows;
		});
};

exports.insertComment = (newComment, article_id) => {
	const { username, body } = newComment;

	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
		.then((articles) => {
			if (articles.rows.length === 0) {
				return Promise.reject({ status: 404, msg: "Not Found" });
			}

			if (body === "") {
				return Promise.reject({ status: 400, msg: "Bad Request" });
			}

			return db.query(
				`INSERT INTO comments (body, article_id, author) 
                VALUES ($1, $2, $3) 
                RETURNING *;`,
				[body, article_id, username]
			);
		})
		.then((data) => {
			return data.rows[0];
		});
};

exports.updateArticleVote = (article_id, inc_votes) => {
	if (isNaN(Number(inc_votes))) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}
	if (inc_votes > 0) {
		return db
			.query(
				`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
				[inc_votes, article_id]
			)
			.then((res) => {
				if (!res.rows.length) {
					return Promise.reject({ status: 404, msg: "Not Found" });
				}

				return res.rows[0];
			});
	} else {
		return db
			.query(
				`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
				[inc_votes, article_id]
			)
			.then((res) => {
				if (!res.rows.length) {
					return Promise.reject({ status: 404, msg: "Not Found" });
				}

				return res.rows[0];
			});
	}
};

exports.deleteComment = (comment_id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
		.then((comments) => {
			if (!comments.rows.length) {
				return Promise.reject({ status: 404, msg: "Not Found" });
			}
			return db.query(`DELETE FROM comments WHERE comment_id = $1 `, [
				comment_id,
			]);
		});
};

exports.selectAllUsers = () => {
	return db.query(`SELECT * FROM users`).then((usersData) => {
		return usersData.rows;
	});
};
