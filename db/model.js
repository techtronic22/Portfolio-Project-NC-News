const db = require('./connection')

exports.selectAllTopics = () => {
    let query = `SELECT * FROM topics`;

    return db.query(query).then((topics) => {
		if (!topics.rows.length) {
			return Promise.reject({ status: 404, msg: "Not Found" });
		}
		return topics.rows;
	});
};
