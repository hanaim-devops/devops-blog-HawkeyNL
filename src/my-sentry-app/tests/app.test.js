const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js'); // Zorg ervoor dat het pad naar je app.js bestand klopt
const Sentry = require('@sentry/node');

chai.use(chaiHttp);
const { expect } = chai;

describe('Test API', () => {
    afterEach(function () {
        // Hier kun je eventueel errors loggen of handmatig Sentry aanroepen
        if (this.currentTest.state === 'failed') {
            // Als de test gefaald is, stuur de error naar Sentry
            Sentry.captureException(this.currentTest.err);
            console.error('Error captured and sent to Sentry:', this.currentTest.err);
        }
    });

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

    it('should fail intentionally to send an error to Sentry', async () => {
        try {
            const res = await chai.request(app).get('/'); // Verander de verwachte statuscode om de test te laten falen
            expect(res).to.have.status(500); // Dit zal niet waar zijn, dus de test zal falen
        } catch (error) {
            // Hier wordt de fout gevangen en de test faalt, maar de afterEach wordt nog steeds aangeroepen
            throw new Error('Intentional failure for Sentry error capture'); // Gooi een fout om de test te laten falen
        }
    });
});
