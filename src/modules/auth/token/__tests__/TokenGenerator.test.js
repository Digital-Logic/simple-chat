import chai, { expect } from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { TokenGenerator, EmailTokenGenerator } from '../TokenGenerator';

chai.use(chaiAsPromise);

describe("Token Generators", () => {
    const secret = "MySupperSecretTokenGeneratorString";
    const user = { id: 'jlakn3lf73l2jf3', email: "joe@dirt.com" };
    const exp = '1h';

    describe("TokenGenerator", () => {
        const tokenGen = new TokenGenerator(secret, exp);

        it('Should generate a token', async () => {
            const token = await tokenGen.sign(user);
            await expect(tokenGen.verify(token)).to.eventually.be.fulfilled
                .with.property("id", user.id);
        });

        it("Should reject invalid tokens", async () => {
            const tokenGen2 = new TokenGenerator('lkasjdfliasdlfkajsdf', '1m');
            const token2 = await tokenGen2.sign(user);
            await expect(tokenGen.verify(token2)).to.eventually.be.rejectedWith("invalid signature");
        });
    });

    describe('EmailTokenGenerator', () => {
        const tokenGen = new EmailTokenGenerator(secret, exp);

        it("Should generate a token", async () => {
            const token = await tokenGen.sign(user, { action: EmailTokenGenerator.ACTIONS.VERIFY_EMAIL });
            await expect(tokenGen.verify(token)).to.eventually.be.fulfilled
                .with.property('id', user.id);
            await expect(tokenGen.verify(token)).to.eventually.be.fulfilled
                .with.property('action', EmailTokenGenerator.ACTIONS.VERIFY_EMAIL);
        });
    });
});