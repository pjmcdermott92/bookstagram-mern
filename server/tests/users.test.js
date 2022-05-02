require('dotenv').config();
process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

const USER_URL = '/api/v1/users';

let TEST_TOKEN;

const userInput = {
    firstName: 'John',
    lastName: 'Hancock',
    email: 'test@example.com',
    password: 'P@ssw0rd!'
};

describe('Testing user resource', () => {
    describe('register a user', () => {
        describe('given firstName, lastName, email, and password is provided', () => {
            it('should return a status of 201 and a token', async () => {
                const { statusCode, body } = await supertest(app)
                    .post(`${USER_URL}/register`)
                    .send(userInput);
                
                expect(statusCode).toBe(201);
                expect(body.success).toBe(true);
                expect(body.token).toEqual(expect.any(String));
            });
        });

        describe('given any required fields are missing', () => {
            it('should return a status of 400 and an error message', async () => {
                const { statusCode, body } = await supertest(app)
                    .post(`${USER_URL}/register`)
                    .send({ firstName: 'John', lastName: 'Hancock', email: 'test@example.com' });

                expect(statusCode).toBe(400);
                expect(body.success).toBe(false);
                expect(body.message).toEqual(expect.any(String));
            });
        });
    });

    describe('log in a user', () => {
        describe('given correct email and password is provided', () => {
            it('should return a status of 200 and a token', async () => {
                const { statusCode, body } = await supertest(app)
                    .post(USER_URL)
                    .send({ email: 'test@example.com', password: 'P@ssw0rd!' });

                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
                expect(body.token).toEqual(expect.any(String));
                TEST_TOKEN = body.token;
            });
        });

        describe('given incorrect email and/or password is provided', () => {
            it('should return a status of 401 and a message of "Invalid Credentials"', async () => {
                const { statusCode, body } = await supertest(app)
                    .post(USER_URL)
                    .send({ email: 'test@incorrect.com', password: 'Inc0rr3ct~' });

                expect(statusCode).toBe(401);
                expect(body.success).toBe(false);
                expect(body.message).toEqual('Invalid Credentials');
            });
        });

        describe('given an email OR a password is not provided', () => {
            it('should return a status of 400 and a message of "Please provide an Email Address and Password"', async () => {
                const { statusCode, body } = await supertest(app)
                    .post(USER_URL)
                    .send({});

                expect(statusCode).toBe(400);
                expect(body.success).toBe(false);
                expect(body.message).toEqual('Please provide an Email Address and Password');
            });
        });
    });

    describe('get current logged in user', () => {
        describe('given a user is signed in with a valid token', () => {
            it('should return a status of 200 and an object with a valid MongoDB user id', async () => {
                const { statusCode, body } = await supertest(app)
                .get(USER_URL)
                .set('authorization', `Bearer ${TEST_TOKEN}`);
                
                expect(statusCode).toBe(200);
                expect(body.success).toBe(true);
                expect(mongoose.Types.ObjectId.isValid(body.data._id)).toBeTruthy();
            });
        });

        describe('given a user has an invalid or expired token or no token', () => {
            it('should return a status of 401 and a message of "Not Authorized"', async () => {
                const { statusCode, body } = await supertest(app)
                .get(USER_URL);

                expect(statusCode).toBe(401);
                expect(body.success).toBe(false);
                expect(body.message).toEqual('Not Authorized.')
            })
        });
    });

    describe('log out a user', () => {
        it('should return a status of 200 and a success of true', async () => {
            const { statusCode, body } = await supertest(app)
                .get(`${USER_URL}/logout`);

            expect(statusCode).toBe(200);
            expect(body.success).toBe(true);
        });
    });
});