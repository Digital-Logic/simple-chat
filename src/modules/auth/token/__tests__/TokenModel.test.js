import chai, { expect } from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { schema, model } from '../TokenModel';
import { refreshToken } from '../index';


chai.use(chaiAsPromise);

describe("Token schema test", () => {
    it("Should have a token field", () => {
        expect(schema.token).to.exist
            .and.have.property('type', String);
        expect(schema.token).to.have.property('required');
        expect(schema.token).to.have.property('unique');
    });
    it("Should have an exp date", () => {
        expect(schema.exp).to.exist
            .and.have.property('type', Date);
        expect(schema.exp).to.have.property('required');
    });
});

describe("Token model test", () => {
    const user = { id: 'jlasdjflanflwi3fu8fsdf', email: "joe@dirt.com" };

    it("Should be able to store a token", async () => {
        const { token, expires } = await refreshToken.sign(user);
        const tokenData = await refreshToken.verify(token);
        await expect(model.create({ token, exp: Date(tokenData.exp )})).to.eventually.be.fulfilled;

        const storedToken = await model.findOne({token });
        expect(storedToken.token).to.equal(token);
    });
});