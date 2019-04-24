        // const storedToken = await model.findOne({token });
import chai, { expect } from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { TokenGenerator, EmailTokenGenerator } from '../TokenGenerator';

chai.use(chaiAsPromise);

describe("Token Generators", () => {
    const secret = "MySupperSecretTokenGeneratorString";
    const user = { _id: 'jlakn3lf73l2jf3', email: "joe@dirt.com" };
    const exp = '1h';

    describe("TokenGenerator", () => {
        const tokenGen = new TokenGenerator(secret, exp);

        it('Should generate a token', async () => {
            const { token } = await tokenGen.sign(user);
            await expect(tokenGen.verify(token)).to.eventually.be.fulfilled
                .with.property("id", user._id);
        });

        it("Should reject invalid tokens", async () => {
            const tokenGen2 = new TokenGenerator('lkasjdfliasdlfkajsdf', '1m');
            const { token: token2 } = await tokenGen2.sign(user);
            await expect(tokenGen.verify(token2)).to.eventually.be.rejectedWith("invalid signature");
        });
    });

    describe('EmailTokenGenerator', () => {
        const tokenGen = new EmailTokenGenerator(secret, exp);

        it("Should generate a token", async () => {
            const { token } = await tokenGen.sign(user, { type: EmailTokenGenerator.TYPE.VERIFY_EMAIL });
            await expect(tokenGen.verify(token)).to.eventually.be.fulfilled
                .with.property('id', user._id);
            await expect(tokenGen.verify(token)).to.eventually.be.fulfilled
                .with.property('type', EmailTokenGenerator.TYPE.VERIFY_EMAIL);
        });
    });
});