import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { cleanDB } from '@fixtures';
import { model as UserModel } from '../../users/model';
import app from '@src/server';

chai.use(chaiHttp);

const testEmailAddress = "testing@digital-logic.net"

/**
 * Setup email in .env.testing
 */

describe.skip("Auth api email test - Requires email service configured", () => {
    const userData = {
        email: testEmailAddress,
        pwd: "hello123",
        firstName: 'Joe',
        lastName: "Dirt"
    };

    beforeEach(cleanDB);

    describe("User sign-in", () => {

        it("User should be able to sign-in", async () => {
            const user = await UserModel.create({ ...userData, accountVerified: true });

            const response = await chai.request(app)
                .post('/user/sign-in')
                .send({ email: user.email, pwd: userData.pwd });

            //console.log(response);
            expect(response).to.have.status(200);
        });
    });

    describe("User sign-up", () => {
        it("Should create a user", async function() {
            // this.timeout(4000); // You may need this if your email provider is slow.

            const response = await chai.request(app)
                    .post('/user/sign-up')
                    .send(userData);
            expect(response).to.have.status(201)
                .with.property('body');
        });

        it("Will not create two users with the same email", async function() {
            // this.timeout(6000); // You may need this if your email provider is slow.

            const response = await chai.request(app)
                .post('/user/sign-up')
                .send(userData);

            expect(response).to.have.status(201);

            const response2 = await chai.request(app)
                .post('/user/sign-up')
                .send(userData);

            expect(response2).to.have.status(409)
                .with.property('body');
        });
    });

    describe("Reset-password", () => {
        it("Should send a reset password email to the user.", async function () {
            // this.timeout(2000);

            await UserModel.create({
                email: testEmailAddress,
                firstName: "Test",
                lastName: "User",
                pwd: "asdf1234",
                accountVerified: true
            });


            const response = await chai.request(app)
                .post('/user/send-reset-password')
                .send({ email: testEmailAddress });

            expect(response).to.have.status(200);
        });
    });


});