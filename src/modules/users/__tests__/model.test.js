import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { schema, model } from '../model';
import { cleanDB } from '@fixtures';
import bcrypt from 'bcrypt';
import { ROLES } from '../../auth/abilities';

chai.use(chaiAsPromised);


describe("User schema test", () => {
    it("Should have an email field", () => {
        expect(schema.email).to.exist
            .and.have.property('type').to.equal(String);
        expect(schema.email).to.have.property('required');
        expect(schema.email.validate.validator("hello@fake-email.com")).to.be.true;
        expect(schema.email).to.have.property("unique");
    });
    it("Should have a password field", () => {
        expect(schema.pwd).to.exist
            .and.have.property('type').to.equal(String);
        expect(schema.pwd).to.have.property('required');
        expect(schema.pwd).to.have.property('minlength');
        expect(schema.pwd).to.have.property('select', false);
    });
    it("Should have role field", () => {
        expect(schema.role).to.exist
            .and.have.property('type').to.equal(String);

        expect(schema.role).to.have.property('required').to.be.true;
        expect(schema.role).to.have.property('default').to.equal(ROLES.USER);
        expect(schema.role).to.have.property('required').to.be.true;
    });
    it("Should have a disabled field", () => {
        expect(schema.disabled).to.exist
            .and.have.property('type').to.equal(Boolean);
        expect(schema.disabled).to.have.property('default').to.be.false;
        expect(schema.disabled).to.have.property('required').to.be.true;
    });
});


describe("User model test", () => {
    beforeEach(cleanDB);

    it('Should be able to create a new user', async () => {
        const user = await model.create({ email: "joe@dirt.com", pwd: "1234asdf"});
        expect(user).to.exist;
        expect(user).to.be.a('object');
        expect(user.email).to.be.a('string');
        expect(user.pwd).to.be.a('string');
    });

    it('Should require a valid email address', async () => {
        await expect( model.create({ email: 'sarah@kdminer', pwd: "1234asdf"})).to.be.rejected;
    });

    it('Should require a unique email address', async () => {
        const user = await model.create({ email: "joe@dirt.com", pwd: "1234asdf"});
        await expect(model.create({email: "joe@dirt.com", pwd: "1234asdf"})).to.be.rejected;
    });
});

describe("User password test", () => {
    beforeEach(cleanDB);

    it('Should encrypt a password', async () => {
        const user = await model.create({email: "joe@dirt.com", pwd: "1234asdf"});
        expect(user.pwd).to.not.equal("1234asdf");
        await expect(bcrypt.compare("1234asdf", user.pwd)).to.eventually.be.true;
    });

    it('Should compare a password', async () => {
        const user = { email: "joe@dirt.com", pwd: "1234asdf" };
        const userEntry = await model.create(user);
        await expect(userEntry.checkPassword(user.pwd)).to.eventually.be.true;
        await expect(userEntry.checkPassword('laskjdflas')).to.eventually.be.false;
    });
});

