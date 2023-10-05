// Error Handling
exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === "23503") {
		res.status(400).send({ msg: "Missing author" });
	}

	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad Request" });
	} else {
		next(err);
	}
};

exports.handleErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};
