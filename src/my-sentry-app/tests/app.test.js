const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js'); // Zorg ervoor dat het pad naar je app.js bestand klopt

chai.use(chaiHttp);
const { expect } = chai;

describe('Test API', () => {
    it('should return Hello World', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Hello World!');
                done();
            });
    });

    it('should trigger an error and send it to Sentry', (done) => {
        chai.request(app)
            .get('/debug-sentry')
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.text).to.include('My first Sentry error!');
                done();
            });
    });
});
