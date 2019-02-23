import { expect } from 'chai';
import controllerGenerator from '../controllerGenerator';
import { cleanDB } from '@fixtures';
import mongoose from 'mongoose';
import { retrieveOrCreate } from '@models/util';
import sinon from 'sinon';


const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is a required field"]
    },
    email: {
        type: String,
        required: [true, "eMail is a required field"]
    }
});

const model = retrieveOrCreate('test_model', schema);

const testData = [
    {
        name: "Larry",
        email: "larry@thecableguy.com"
    },{
        name: "John",
        email: "john@doe.com"
    },{
        name: "Sarah",
        email: "sarah@something.com"
    },{
        name: "Bob",
        email: "bob@thebuilder.com"
    }
];

describe("controllerGenerator", () => {
    let controller;
    let req, res, next;

    beforeEach(() => {
        controller = controllerGenerator(model);

        res = {
            status: sinon.fake( status => {
                return res;
            }),
            json: sinon.fake()
        };
        next = sinon.fake();

        req = {
            params: {
            },
            body: {
            }
        };

        return cleanDB()
            .then(() => {
                return Promise.all(testData.map( data => model.create(data) ))
            })
            .catch(() => {
                throw new Error("Error creating test data to test generateController");
            });
    });

    // Test each verbs in the controller generated

    describe("Get all", () => {
        it("Should get all objects in the database", async () => {

            res.json = sinon.fake(data => {
                expect(data).to.be.an('array')
                    .with.property('length', 4);
            });

            await controller.getAll(req, res, next);

            expect(res.json.calledOnce).to.equal(true);
            expect(next.notCalled).to.equal(true);
        });
    });

    describe("Get One", () => {
        it("Should get one object by id", async () => {
            const data = await model.findOne({ name: testData[1].name }).exec();

            req.resource = data;
            res.json = sinon.fake(response => {
                expect(response).to.be.an('object')
                    .with.property("_id", data._id);
            });

            await controller.getOne(req, res, next);
            expect(res.json.calledOnce).to.equal(true);
            expect(next.notCalled).to.equal(true);
        });
    });

    describe("findByParam", () => {
        it("Should get document by id", async () => {
            const data = await model.findOne({ name: "Sarah"});
            req.params.id = data._id;
            next = sinon.fake(error => {
                expect(error).to.equal(undefined);
            });

            await controller.findByParam(req, res, next, data._id, "id");

            expect(req.resource).to.be.an('object');

        });

        it("Should throw an error when provided an invalid id", async () => {
            next = sinon.fake(err => {
                expect(err).to.exist
                    .and.be.an.instanceOf(Error)
                    .with.property('message', 'Resource not found');
            });
            await controller.findByParam(req, res, next, "5c53b1345811410ebc6ea0a4", "id");

            expect(next.calledOnce).to.equal(true);
        });
    });

    describe("Create one", () => {
        it("Should create a new model", async () => {
            req.body = {
                name: "Blake",
                email: "blake@gmail.com"
            };
            res.json = sinon.fake( model => {
                expect(model).to.have.property("name", "Blake");
                expect(model).to.have.property("email", "blake@gmail.com");
            });

            await controller.createOne(req, res, next);
            expect(res.json.called).to.equal(true);
            expect(next.notCalled).to.equal(true);
            expect(res.status.lastArg).to.equal(201)
            expect(await model.countDocuments().exec()).to.equal(testData.length + 1);
        });
    });

    describe("Delete one", () => {
        it("Should delete a model", async () => {
            const doc = await model.findOne().exec();
            req.resource = doc;
            req.params.id = doc._id;

            await controller.deleteOne(req, res, next);
            expect(await model.countDocuments().exec()).to.equal(testData.length - 1);
            expect(next.notCalled).to.equal(true, "Controller throw an error.");
            expect(res.status.lastArg).to.equal(202);
            expect(res.json.calledOnce).to.equal(true);
            expect(res.json.lastArg).to.have.property('_id').to.eql(doc._id);
        });
    });

    describe("Update one", () => {
        it("Should update a model", async () => {
            const doc = await model.findOne({ name: "Sarah"}).exec();

            req.resource = doc;
            req.body = {
                email: "sBoth@kdminer.com"
            };

            await controller.updateOne(req, res, next);

            expect(next.notCalled).to.equal(true, "Exception was thrown");
            expect(res.json.calledOnce).to.equal(true);
            expect(res.json.lastArg).to.have.property('_id').to.eql(doc._id, "Document id's do not match");
            expect(res.json.lastArg).to.have.property('email').to.not.equal(doc._email, "Email address was not updated");
        });
    });
});