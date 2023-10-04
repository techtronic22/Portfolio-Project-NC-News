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

