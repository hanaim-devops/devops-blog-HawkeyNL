const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js'); // Zorg ervoor dat het pad naar je app.js bestand klopt

chai.use(chaiHttp);
const { expect } = chai;

describe('Test API', () => {
    it('should trigger an error and send it to Sentry', async () => {
        const res = await chai.request(app).get('/debug-sentry');
        expect(res).to.have.status(500);
        expect(res.text).to.include('My first Sentry error!');
    });

    it('should return Hello World', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello World!');
    });

    it('should return a 404 for an unknown route', async () => {
        const res = await chai.request(app).get('/unknown');
        expect(res).to.have.status(404);
    });
});

