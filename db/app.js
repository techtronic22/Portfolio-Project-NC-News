const express = require("express");
const {getAllTopics} = require("./controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);


// Error Handling
app.use((err, req, res, next) => {
    console.log(err)
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
});


app.all('*', (req, res) => {
    res.status(404).send({msg: 'Invalid Path'})
})

module.exports = app;
