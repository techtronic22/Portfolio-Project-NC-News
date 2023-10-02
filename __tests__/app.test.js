const request = require('supertest')
const app = require('../db/app')
const db = require('../db/connection')
const seed = require ('../db/seeds/seed')
const data = require('../db/data/test-data')
const sorted = require('jest-sorted')



beforeEach(() => seed(data))
afterAll(() => db.end())
describe('GET api/topics', () => {
    test('should return a status code of 200 with an array of objects ', () => {
        return request(app)
        .get('/api/topics/')
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topics) => {
                expect(typeof(topics.slug)).toBe('string')
                expect(typeof(topics.description)).toBe('string')
                });
    });
    })
})