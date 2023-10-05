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

exports.selectAllArticles = (sort_by = "created_at", order = "desc") => {
	let query = `
    SELECT 
        articles.article_id,
        articles.author,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
		COUNT(comments.article_id) AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
	GROUP BY articles.article_id
	ORDER BY articles.created_at DESC;`;

	return db.query(query).then((articles) => {
		if (!articles.rows.length) {
			return Promise.reject({ status: 404, msg: "Not Found" });
		}
		return articles.rows;
	});
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
	if (!Number(article_id)) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}

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
                RETURNING *;`, [body, article_id, username]
            );
        })
        .then((data) => {
            return data.rows[0]
        });
};
