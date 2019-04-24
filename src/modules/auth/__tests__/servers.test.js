import chai, { expect } from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { cleanDB } from '@fixtures';
import sinon from 'sinon';
import { model } from '../../users/model';
import { ROLES } from '../abilities';
import { sendResetPasswordGenerator, signUpRouteGenerator, resetUserPassword,
        signIn, signOut, changePassword, getAccessToken, validateToken } from '../services';
import { defineAbilitiesFor } from '../abilities';
import { Unauthorized } from 'http-errors';
import { emailToken } from '../emailGenerators';
import { EmailTokenGenerator, accessToken, refreshToken } from '../token';

chai.use(chaiAsPromise);

describe("Auth services", () => {
    let req ,res, next;

    beforeEach(() => {
        req = {
            ability: defineAbilitiesFor(),
            body: {},
            params: {}
        };
        res = {
            status: sinon.fake(code => res),
            json: sinon.fake(data => data),
            send: sinon.fake(data => data),
            end: sinon.fake(data => data),
            cookie: sinon.fake((name, token) => {})
        };
        next = sinon.fake(e => e);

        return cleanDB();
    });

    describe("Sign-up route", () => {

        it("Should allow a user to sign-up", async () => {
            req.body = {
                email: "bob@barker.com",
                pwd: "asdf1234",
                firstName: "Bob",
                lastName: "Barker"
            };

            const action = sinon.fake(user => Promise.resolve(user));
            const signUp = signUpRouteGenerator(action);

            await expect(signUp(req, res, next)).to.eventually.be.fulfilled;
            expect(next.callCount).to.equal(0, next.getCall(0));

            expect(action.calledOnce).to.be.true;

            expect(action.getCall(0).args[0]).to.have.property('accountVerified').to.be.false;
            expect(action.getCall(0).args[0]).to.have.property('pwd').to.not.equal(req.body.pwd);
            expect(action.getCall(0).args[0]).to.have.property('role').to.equal(ROLES.USER);
        });

        it("Should ignore 'role' and 'accountVerified' fields if user does not have permission to enter them.", async () => {
            const action = sinon.fake(user => Promise.resolve(user));
            const signUp = signUpRouteGenerator(action);

            req.body = {
                email: "bob@barker.com",
                pwd: "asdf1234",
                firstName: "Bob",
                lastName: "Barker",
                role: ROLES.ADMIN,
                accountVerified: true
            };
            await expect(signUp(req, res, next)).to.eventually.be.fulfilled;

            expect(action.calledOnce).to.be.true;
            const newUser = action.getCall(0).args[0];
            expect(newUser.role).to.equal(ROLES.USER);
            expect(newUser.accountVerified).to.be.false;
        });
    });

    describe("Sign-in route", () => {
        it('Should allow a user to sign-in', async () => {
            const user = await createUser();
            user.accountVerified = true;
            await user.save();

            req.body = {
                email: user.email,
                pwd: "asdf1234"
            };

            await signIn(req, res, next);
            expect(next.callCount).to.equal(0, next.call(0));
            expect(res.status.getCall(0).args[0]).to.equal(200);
            expect(res.cookie.callCount).to.equal(2);
        });

        it('Should prevent a user from signing-in with invalid password', async () => {
            const user = await createUser();
            user.accountVerified = true;
            await user.save();
            req.body = {
                email: user.email,
                pwd: "asdf1234f"
            };

            await signIn(req, res, next);
            expect(next.calledOnce).to.be.true;
            expect(next.getCall(0).args[0]).to.be.an.instanceOf(Unauthorized);
            expect(res.status.notCalled).to.be.true;
        });
    });

    describe("Reset user password", () => {
        it("Should allow a user to reset there password.", async () => {
            // create a new user
            const user = await createUser();
            user.accountVerified = true;
            await user.save();
            //await verifyAccount(user);

            const action = sinon.fake(user => user);
            // Generate our route
            const sendResetPasswordEmail = sendResetPasswordGenerator(action);
            req.body = {
                email: user.email
            };

            await expect(sendResetPasswordEmail(req, res, next)).to.eventually.be.fulfilled;
            expect(next.callCount).to.equal(0, next.getCall(0));
            expect(action.calledOnce).to.be.true;
            const userData = action.getCall(0).args[0];
            expect(userData).has.property('_id').to.eql(user._id);

            // Reset spies state
            next.resetHistory(); res.status.resetHistory(); res.json.resetHistory();
            res.send.resetHistory(); res.end.resetHistory();

            // // Create token
            const { token } = await emailToken.sign(user, { type: emailToken.TYPE.RESET_PASSWORD });

            // // Reset user password
            req.body = {
                token,
                pwd: 'helloWorld'
            };

            await expect(resetUserPassword(req, res, next)).to.eventually.be.fulfilled;
            expect(next.notCalled).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.getCall(0).args[0]).to.equal(200);
        });
    });

    describe("Change password route", () => {
        it("Should allow a logged-in user to change there password", async () => {
            // create a new user
            const user = await createUser();
            // define abilities for the new user
            req.ability = defineAbilitiesFor(user);
            req.body.password = 'asdf1234';
            req.body.newPassword = 'qwerasdf';
            req.user = {
                _id: user.id
            };

            await expect(changePassword(req, res, next)).to.eventually.be.fulfilled;
            expect(next.calledOnce).to.be.false;
            await expect(user.checkPassword(req.body.newPassword)).to.eventually.be.fulfilled;

            // verify the database was updated.
            const userCp = await model.findById(user.id);
            await expect(userCp.checkPassword(req.body.newPassword)).to.eventually.be.fulfilled;
        });

        it('Passwords that do not pass validation, should not be updated', async () => {
            const user = await createUser();

            req.ability = defineAbilitiesFor(user);
            req.body.password = 'asdf1234';
            req.body.newPassword = "asdf"; // password should be 7 characters long
            req.user = user;

            await expect(changePassword(req, res, next)).to.eventually.be.fulfilled;
            expect(next.calledOnce).to.be.true;
        });
    });

    describe("Verify email address route", () => {
        it("Should verify a user account from a token", async () => {
            req.body = {
                email: 'bob@barker.com',
                pwd: "asdf1234",
                firstName: "Bob",
                lastName: "Barker"
            };

            const action = sinon.fake(user => Promise.resolve(user));
            const signUp = signUpRouteGenerator(action);
            await expect(signUp(req, res, next)).to.eventually.be.fulfilled;
            expect(next.notCalled).to.be.true;
            expect(action.calledOnce).to.be.true;
            const user = action.getCall(0).args[0];
            const token = await emailToken.sign(user, { type: EmailTokenGenerator.TYPE.VERIFY_EMAIL });

            req.body = {
                ...token
            };
            // Reset spies history
            res.status.resetHistory(); res.json.resetHistory();
            res.send.resetHistory(); res.end.resetHistory();
            next.resetHistory();


            await expect(validateToken(req, res, next)).to.eventually.fulfilled;
            expect(next.notCalled).to.be.true;
            expect(res.status.getCall(0).args[0]).to.equal(200);
            expect(res.status.callCount).to.equal(1);
        });
    });
});


async function createUser(userData) {
    const req = {
            ability: defineAbilitiesFor(),
            body: {
                email: "bob@barker.com",
                pwd: "asdf1234",
                firstName: "Bob",
                lastName: "Barker",
                ...userData // overwrite with user provided info
            },
            params: {}
        },
        res = {
            status: sinon.fake(code => res),
            json: sinon.fake(data => data),
            send: sinon.fake(data => data),
            end: sinon.fake(data => data)
        },
        next = sinon.fake(e => e),
        action = sinon.fake(user => Promise.resolve(user)),

    signUp = signUpRouteGenerator(action);

    await expect(signUp(req, res, next)).to.eventually.be.fulfilled;
    expect(next.callCount).to.equal(0, next.getCall(0));
    expect(action.calledOnce).to.be.true;

    return action.getCall(0).args[0];
}

