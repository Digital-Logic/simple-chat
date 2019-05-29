import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '@src/server';

chai.use(chaiHttp);


describe.skip("Server is up", () => {
    it('Should get a 200 response from "/"', async () => {
        const result = await chai.request(app)
            .get('/');

        expect(result).to.have.status(200);
    });
});
