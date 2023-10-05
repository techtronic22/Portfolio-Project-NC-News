const request = require("supertest");
const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const sorted = require("jest-sorted");
const endpoints = require("../endpoints.json");


beforeEach(() => seed(data));
afterAll(() => db.end());
describe("GET api/topics", () => {
	test("should return a status code of 200 with an array of objects ", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				expect(body.topics).toHaveLength(3);
				body.topics.forEach((topics) => {
					expect(typeof topics.slug).toBe("string");
					expect(typeof topics.description).toBe("string");
				});
			});
	});
});

describe("GET api/invalidpath", () => {
	test("should return error code 404 Not Found when provided non-existent route ", () => {
		return request(app)
			.get("/api/invalidpath")
			.expect(404)
			.then(({ body }) => {
				expect(body).toHaveProperty("msg");
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("GET /api", () => {
	test("should return all api endpoints with descriptions from endpoints.json", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(endpoints);
			});
	});
});

describe("GET /api/articles/:article_id", () => {
	test("should return a status code of 200 with the requested article", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				expect(typeof body.article).toBe("object");
				expect(body.article).toHaveProperty("article_id");
				expect(body.article.article_id).toBe(1);
				expect(body.article).toHaveProperty("title");
				expect(body.article).toHaveProperty("author");
				expect(body.article).toHaveProperty("body");
				expect(body.article).toHaveProperty("topic");
				expect(body.article).toHaveProperty("created_at");
				expect(body.article).toHaveProperty("votes");
				expect(body.article).toHaveProperty("article_img_url");
			});
	});

	test("should return error code 404 Not Found for a non-existent article_id", () => {
		return request(app)
			.get("/api/articles/9999")
			.expect(404)
			.then(({ body }) => {
				expect(body).toHaveProperty("msg");
				expect(body.msg).toBe("Article not found");
			});
	});

	test("should return error code 400 Bad Request for an invalid article_id", () => {
		return request(app)
			.get("/api/articles/invalid_id")
			.expect(400)
			.then(({ body }) => {
				expect(body).toHaveProperty("msg");
				expect(body.msg).toBe("Bad Request");
			});
	});
});

describe("GET api/articles", () => {
	test("should return a status code of 200 with an array of objects ", () => {
		return request(app)
			.get("/api/articles/")
			.expect(200)
			.then(({ body }) => {
				expect(Array.isArray(body.articles)).toBe(true);
				expect(body.articles).toHaveLength(13);
				expect(body.articles).toBeSorted({
					descending: true,
					key: "created_at",
				});
				body.articles.forEach((article) => {
					expect(article).toHaveProperty("author");
					expect(article).toHaveProperty("title");
					expect(article).toHaveProperty("article_id");
					expect(article).toHaveProperty("topic");
					expect(article).toHaveProperty("created_at");
					expect(article).toHaveProperty("votes");
					expect(article).toHaveProperty("article_img_url");
					expect(article).not.toHaveProperty("body");
					expect(article).toHaveProperty("comment_count");
				});
			});
	});
});

describe("GET /api/articles/:article_id/comments", () => {
	test("should return a status code of 200 with an array of comments for the given article_id, ordered by latest", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toHaveLength(11);
				expect(Array.isArray(body.comments)).toBe(true);
				expect(body.comments).toBeSorted({ descending: true, key: 'created_at' });
				body.comments.forEach((comment) => {
					expect(comment).toHaveProperty("comment_id");
					expect(comment).toHaveProperty("votes");
					expect(comment).toHaveProperty("created_at");
					expect(comment).toHaveProperty("author");
					expect(comment).toHaveProperty("body");
					expect(comment).toHaveProperty("article_id", 1);
				});
			});
	})

	test('should return a status code of 404 Not Found for an article_id that does not exist', () => {
		return request(app)
		.get("/api/articles/99/comments")
		.expect(404)
		.then(({ body }) => {
			expect(body.msg).toBe('Not Found')
		}) 		
	});

	test('should return a status code of 200 with an empty array for an article_id that exists but doesn"t have a comment', () => {
		return request(app)
		.get("/api/articles/10/comments")
		.expect(200)
		.then(({ body }) => {
			expect(body.comments).toEqual([])
		}) 		
	});

	test('should return a status code of 400 Bad Request for an invalid article_id', () => {
		return request(app)
		.get("/api/articles/noarticle/comments")
		.expect(400)
		.then(({ body }) => {
			expect(body.msg).toBe('Bad Request')
		}) 		
	});

})

describe('POST /api/articles/:article_id/comments', () => {
	test('should return a status code of 201 and a new comment posted to the database', () => {
		const newComment = {
			username: 'icellusedkars',
			body: 'Great article on how to build endpoints!'
		}		
		
		return request(app)
		.post('/api/articles/6/comments')
		.send(newComment)
		.expect(201)
		.then(({ body }) => {
			expect(body.body).toBe('Great article on how to build endpoints!')
			expect(body.comment_id).toBe(19)
			expect(body.article_id).toBe(6)
			expect(body.author).toBe('icellusedkars')
			expect(body.votes).toBe(0)
			expect(body).toHaveProperty('created_at')
		})
	});

	test('should return a status code of 201 and a new comment posted to the database, ignoring any unnecessary properties', () => {
		const newComment = {
			username: 'icellusedkars',
			body: 'Great article on how to build endpoints!',
			age: 'Not Applicable'
		}		
		
		return request(app)
		.post('/api/articles/6/comments')
		.send(newComment)
		.expect(201)
		.then(({ body }) => {
			expect(body.body).toBe('Great article on how to build endpoints!')
			expect(body.comment_id).toBe(19)
			expect(body.article_id).toBe(6)
			expect(body.author).toBe('icellusedkars')
			expect(body.votes).toBe(0)
			expect(body).toHaveProperty('created_at')
			expect(body).not.toHaveProperty('age')
		})
	});
	
	test('should return a status code of 400 when user leaves a blank comment', () => {
		const newComment = {
			username: 'icellusedkars',
			body: ''
		}		
		
		return request(app)
		.post('/api/articles/6/comments')
		.send(newComment)
		.expect(400)
		.then(({ body }) => {
			expect(body.msg).toBe('Bad Request')
		})
	});

	test('should return a status code of 400 when user leaves a blank comment', () => {
		const newComment = {
			username: '',
			body: 'I love this article, it really inspires me'
		}		
		
		return request(app)
		.post('/api/articles/6/comments')
		.send(newComment)
		.expect(400)
		.then(({ body }) => {
			expect(body.msg).toBe('Missing author')
		})
	});
	
	
	test('should return a status code of 400 for an invalid article_id', () => {
		const newComment = {
			username: 'icellusedkars',
			body: 'Very useful article !'
		}		
		
		return request(app)
		.post('/api/articles/rubbish/comments')
		.send(newComment)
		.expect(400)
		.then(({ body }) => {
			expect(body.msg).toBe('Bad Request')
		})
	});

	test('should return a status code of 404 for an article_id which doesn"t exist', () => {
		const newComment = {
			username: 'icellusedkars',
			body: 'Very useful article !'
		}		
		
		return request(app)
		.post('/api/articles/99/comments')
		.send(newComment)
		.expect(404)
		.then(({ body }) => {
			expect(body.msg).toBe('Not Found')
		})
	});


});

describe('PATCH /api/articles/:article_id', () => {
	test('should return status code 200 and update article votes to specified amount (incremented) ', () => {
		const votesBody = { inc_votes : 1 }
		return request(app)
		.patch('/api/articles/6')
		.send(votesBody)
		.expect(200)
		.then(({body}) => {
			expect(body).toHaveProperty('author')
			expect(body).toHaveProperty('title')
			expect(body).toHaveProperty('article_id')
			expect(body).toHaveProperty('body')
			expect(body).toHaveProperty('topic')
			expect(body).toHaveProperty('created_at')
			expect(body).toHaveProperty('votes')
			expect(body.votes).toEqual(1)
			expect(body).toHaveProperty('article_img_url')
		})
	});
	
	test('should return status code 200 and update article votes to specified amount (decremented) ', () => {
		const votesBody = { inc_votes : -1 }
		return request(app)
		.patch('/api/articles/6')
		.send(votesBody)
		.expect(200)
		.then(({body}) => {
			expect(body).toHaveProperty('author')
			expect(body).toHaveProperty('title')
			expect(body).toHaveProperty('article_id')
			expect(body).toHaveProperty('body')
			expect(body).toHaveProperty('topic')
			expect(body).toHaveProperty('created_at')
			expect(body).toHaveProperty('votes')
			expect(body.votes).toEqual(-1)
			expect(body).toHaveProperty('article_img_url')
		})
	});
	
		test('should return status code 200 and update article votes to specified amount (incremented) ', () => {
		const votesBody = { inc_votes : 1 }
		return request(app)
		.patch('/api/articles/6')
		.send(votesBody)
		.expect(200)
		.then(({body}) => {
			expect(body).toHaveProperty('author')
			expect(body).toHaveProperty('title')
			expect(body).toHaveProperty('article_id')
			expect(body).toHaveProperty('body')
			expect(body).toHaveProperty('topic')
			expect(body).toHaveProperty('created_at')
			expect(body).toHaveProperty('votes')
			expect(body.votes).toEqual(1)
			expect(body).toHaveProperty('article_img_url')
		})
	});
	
	test('should return status code 400 when the vote value is not a number', () => {
		const votesBody = { inc_votes : 'abc' }
		return request(app)
		.patch('/api/articles/6')
		.send(votesBody)
		.expect(400)
		.then(({body}) => {
			expect(body.msg).toBe('Bad Request')
		})
	});

	test('should return status code 404 for an article_id that doesn"t exist', () => {
		const votesBody = { inc_votes : 5 }
		return request(app)
		.patch('/api/articles/99')
		.send(votesBody)
		.expect(404)
		.then(({body}) => {
			expect(body.msg).toBe('Not Found')
		})
	});

	test('should return status code 400 for an invalid article_id', () => {
		const votesBody = { inc_votes : 3 }
		return request(app)
		.patch('/api/articles/rubbish')
		.send(votesBody)
		.expect(400)
		.then(({body}) => {
			expect(body.msg).toBe('Bad Request')
		})
	});
});