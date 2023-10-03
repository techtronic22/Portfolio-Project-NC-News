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
		return Promise.reject({status: 400, msg:'Bad Request'} )
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
