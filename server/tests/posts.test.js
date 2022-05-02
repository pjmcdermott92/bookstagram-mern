require('dotenv').config();
process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

const POST_URL = '/api/v1/posts';

let TEST_TOKEN, TEST_IMG_URL, TEST_POST_ID;

const userInput = {
    firstName: 'John',
    lastName: 'Hancock',
    email: 'testuser@example.com',
    password: 'P@ssw0rd!'
};

const registerTestUser = async () => {
    const { body } = await supertest(app)
        .post('/api/v1/users/register')
        .send(userInput);
    
    TEST_TOKEN = body.token;
}

describe('Testing post resource', () => {
    beforeAll(async () => await registerTestUser());

    describe('get post upload url', () => {
        describe('given a user is authenticated', () => {
            it('should return a status of 200 and an object with an uploadUrl and an imageUrl', async () => {
                const { statusCode, body } = await supertest(app)
                    .get(`${POST_URL}/upload/get-url`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
                expect(body.data.uploadUrl).toEqual(expect.any(String));
                expect(body.data.imageUrl).toEqual(expect.any(String));

                TEST_IMG_URL = body.data.imageUrl;
            });
        });

        describe('given user is unauthorized or token is invalid', () => {
            it('should retun a status of 401 and a success of false', async () => {
                const { statusCode, body } = await supertest(app)
                    .get(`${POST_URL}/upload/get-url`);

                expect(statusCode).toBe(401);
                expect(body.success).toBe(false);
            });
        });
    });


    describe('save uploaded post data to DB', () => {
        describe('given a title and an imageUrl is provided', () => {
            it('should return a status of 201 and a post object with a valid MongoDB URL', async () => {
                const { statusCode, body } = await supertest(app)
                    .post(`${POST_URL}/upload`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`)
                    .send({ title: 'Test Post Title', imageUrl: TEST_IMG_URL });

                expect(statusCode).toBe(201);
                expect(body.success).toBe(true);
                expect(mongoose.Types.ObjectId.isValid(body.data._id)).toBeTruthy();

                TEST_POST_ID = body.data._id;
            });
        });
    });

    describe('get all posts in the database', () => {
        describe('given a user is authenticated and a post exists', () => {
            it('should return a status of 200 and an array of posts', async () => {
                const { statusCode, body } = await supertest(app)
                    .get(POST_URL)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(200);
                expect(body.data.length > 0).toBeTruthy();
            });
        });

        describe('given there is no logged in user or token is invalid/expired', () => {
            it('should return a status code of 401 and a message of "Not Authorized."', async () => {
                const { statusCode, body } = await supertest(app)
                    .get(POST_URL);

                expect(statusCode).toBe(401);
                expect(body.message).toEqual('Not Authorized.');
            });
        });
    });

    describe('user likes a post', () => {
        describe('given current user does NOT already like specific post', () => {
            it('should return a status of 200 and a success of true', async () => {
                const { statusCode, body } = await supertest(app)
                    .put(`${POST_URL}/like/${TEST_POST_ID}`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
            });
        });

        describe('given current user already likes the post', () => {
            it('should return a status of 400 and a message of "Post already liked"', async() => {
                const { statusCode, body } = await supertest(app)
                    .put(`${POST_URL}/like/${TEST_POST_ID}`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual('Post already liked');
            });
        });
    });

    describe('user unlikes post', () => {
        describe('given current user likes the post', () => {
            it('should return a status of 200 and a success of true', async () => {
                const { statusCode, body } = await supertest(app)
                    .put(`${POST_URL}/unlike/${TEST_POST_ID}`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
            });
        });

        describe('given that current user does NOT like the post', () => {
            it('should return a status of 400 and a message of "Post not yet liked"', async () => {
                const { statusCode, body } = await supertest(app)
                    .put(`${POST_URL}/unlike/${TEST_POST_ID}`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(400);
                expect(body.message).toEqual('Post not yet liked');
            });
        });
    });

    describe('user deletes a post', () => {
        describe('given the current user DOES NOT own the post', () => {
            it('should return a status of 403 and a message of "You are not authorized to delete this post"', async () => {
                const newUser = await supertest(app)
                    .post('/api/v1/users/register')
                    .send({ firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com', password: 'P@ssW0rd!!' });
                const newToken = newUser.body.token;

                const { statusCode, body } = await supertest(app)
                    .delete(`${POST_URL}/${TEST_POST_ID}`)
                    .set('authorization', `Bearer ${newToken}`);
                
                expect(statusCode).toBe(403);
                expect(body.message).toEqual('You are not authorized to delete this post');
            });
        });

        describe('given the current user DOES own the post', () => {
            it('should return a status of 200 and a success of true', async () => {
                const { statusCode, body } = await supertest(app)
                    .delete(`${POST_URL}/${TEST_POST_ID}`)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
            });

            it('should remove the post from the DB', async () => {
                const { statusCode, body } = await supertest(app)
                    .get(POST_URL)
                    .set('authorization', `Bearer ${TEST_TOKEN}`);

                expect(statusCode).toBe(200);
                expect(body.data.length).toBe(0);
            })
        });
    });
});
