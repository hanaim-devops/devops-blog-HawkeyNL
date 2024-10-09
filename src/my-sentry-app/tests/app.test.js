const fs = require('fs');
const path = require('path');
const Sentry = require('@sentry/node');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app.js'); // Zorg ervoor dat het pad naar je app.js bestand klopt
const logFilePath = path.join(__dirname, '../logs/test-output.log'); // Log file path

chai.use(chaiHttp);
const { expect } = chai;

describe('Test API', () => {
    before(function () {
        // Maak een logbestand als het nog niet bestaat
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '', { encoding: 'utf8' });
        }

        // Maak het logbestand leeg
        fs.writeFileSync(logFilePath, '', { encoding: 'utf8' });
    });

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            // Als de test gefaald is, stuur de error naar Sentry
            Sentry.captureException(this.currentTest.err);
            writeLog(`Test failed: ${this.currentTest.title} - Error: ${this.currentTest.err}`);
            console.error('Error captured and sent to Sentry:', this.currentTest.err);
        }
    });

    it('should return error', async () => {
        const res = await chai.request(app).get('/debug-sentry');
        expect(res).to.have.status(500);
    });

    it('should return Hello World', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello World!');
    });

    it('should fail intentionally to send an error to Sentry', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(500); // This will fail
    });
});

function writeLog(data) {
    fs.appendFileSync(logFilePath, data + '\n', { encoding: 'utf8' });
}

