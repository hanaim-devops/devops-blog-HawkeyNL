# Met Sentry naar een foutloze toekomst

<img src="plaatjes/sentry.svg" width="250" align="right" alt="Sentry">

*[Gus Theunissen, Oktober 2024.](https://github.com/hanaim-devops/blog-student-naam)*
<hr/>

## Inleiding

Voor de Minor DevOps aan de Hogeschool van Arnhem en Nijmegen schrijf ik een blogpost over Sentry, een tool die veel wordt gebruikt binnen de DevOps-wereld om de kwaliteit en prestaties van software te verbeteren. In DevOps en softwareontwikkeling is het proactief opsporen en oplossen van problemen van groot belang. Sentry biedt niet alleen error tracking, maar ook application performance monitoring (APM), waardoor ontwikkelaars snel en efficiënt problemen kunnen detecteren en oplossen.

Deze blogpost gaat dieper in op hoe je Sentry kunt integreren in een Node.js applicatie, hoe je het kunt gebruiken binnen een CI/CD-pipeline, en hoe het kan bijdragen aan een hogere softwarekwaliteit door fouten proactief te signaleren. Je krijgt bovendien een hands-on voorbeeld van de implementatie en configuratie in een real-world setting.

## Sentry

Sentry is een developer-first platform voor error tracking en performance monitoring. Het helpt ontwikkelaars om snel inzicht te krijgen in wat er daadwerkelijk misgaat in hun applicaties en om problemen efficiënt op te lossen. Door fouten en prestatieproblemen direct te signaleren, kunnen ontwikkelaars sneller reageren en zo de stabiliteit en prestaties van hun applicaties verbeteren. Sentry biedt niet alleen de mogelijkheid om problemen op te sporen, maar ook om continu te leren over het gedrag van je applicaties, zodat je proactief verbeteringen kunt doorvoeren.

Dit platform is ontworpen met ontwikkelaars in gedachten, wat betekent dat het eenvoudig te integreren is met veelgebruikte frameworks en tools zoals Node.js, Express, en CI/CD-systemen. Hierdoor kunnen teams hun software-ontwikkeling optimaliseren en een hogere mate van controle en inzicht behouden in hun productieomgevingen.

## Integratie met Node.js

Om Sentry te integreren in een Node.js applicatie met Express, begin ik met het opzetten van een eenvoudige Node.js Express-applicatie. Ik heb gekozen voor Node.js met Express omdat ik het Web Development profiel volg aan de Hogeschool van Arnhem en Nijmegen (HAN) en veel ervaring heb met deze technologieën. Dit is de eerste stap voordat ik Sentry toevoeg om fouten en prestaties te monitoren. Hier is een stapsgewijze handleiding:

### Stap 1: Node.js Installeren

Ik zorg ervoor dat Node.js geïnstalleerd is op mijn systeem. Dit controleer ik met het volgende commando in de terminal:

```bash
node -v
```

Als Node.js nog niet geïnstalleerd is, volg ik de installatie-instructies op de officiële Node.js-website.

### Stap 2: Express Applicatie Opzetten

Ik maak een nieuwe directory aan voor mijn applicatie en navigeer naar die map in de terminal:

```bash
mkdir my-sentry-app
cd my-sentry-app
```

Vervolgens initialiseer ik een nieuw Node.js-project met npm:

```bash
npm init -y
```

Dit maakt een `package.json` bestand aan waarin de informatie over je project wordt opgeslagen.

### Stap 3: Express Installeren

Ik installeer Express in mijn project met npm:

```bash
npm install express
```

### Stap 4: Express Applicatie Schrijven

In mijn project maak ik een bestand genaamd app.js en voeg de volgende basiscode toe:

```js
const express = require('express');
const app = express();

// Maak een eenvoudige route die 'Hello World' retourneert
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Luister op poort 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Stap 5: Applicatie Starten

Ik start mijn Express-applicatie met het volgende commando:

```bash
node app.js
```

Als alles goed is gegaan, zie ik de tekst "Server is running on http://localhost:3000" in de terminal. In mijn browser navigeer ik naar http://localhost:3000 en zie ik de boodschap "Hello World!".

<img src="plaatjes/localhost3000_stap_1.png" alt="localhost3000_stap_1" height="274">

*Figuur 1: Express-applicatie die "Hello World!" retourneert op http://localhost:3000*

### Stap 6: Sentry Integreren

Nu mijn Express-applicatie draait, is het tijd om Sentry toe te voegen om fouten en prestaties te monitoren.

Eerst heb ik een Sentry-account nodig om een project aan te maken en de benodigde configuratiegegevens te verkrijgen. Dit zijn de stappen die ik volg:
- Ik login op [Sentry-account](https://sentry.io).
- Daarna maak ik een nieuw project aan met de volgende instellingen:
  - Platform (in mijn geval Node.js).
  - Alerting frequency (standaard).
  - Een naam en team uitkiezen.

<img src="plaatjes/sentry-project-aanmaken-nodejs.png" width="773" alt="Sentry project aanmaken">

*Figuur 2: Nieuw project aanmaken in Sentry voor Node.js*

Nadat ik het project had aangemaakt kwam Sentry nog met de vraag of ik een framework gebruik. Aangezien ik Express gebruik, vink ik Express aan als framework.

<img src="plaatjes/sentry-framework-selectie.png" width="358" alt="Sentry framework selectie">

*Figuur 3: Framework selectie in Sentry*

Hierna krijg ik de configuratiegegevens die ik nodig heb om Sentry in mijn project te integreren.

### Stap 7: Sentry SDK Installeren

Om de Sentry SDK in mijn Node.js-project te installeren, volg ik de instructies van Sentry:

```bash
npm install --save @sentry/node @sentry/profiling-node
```

Vervolgens maak ik een `initSentry.js` bestand aan in mijn project en voeg ik de volgende code toe om Sentry te initialiseren:

```js
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "YOUR_DSN_URL",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
```

Ik vervang YOUR_DSN_URL door de DSN die ik heb gekregen van Sentry.

Om Sentry te gebruiken in mijn Express-applicatie, voeg ik de volgende regel toe aan het begin van mijn app.js bestand:

```js
require('./initSentry');
```

### Stap 8: Fout- en Prestatiemonitoring Toevoegen

Nu voeg ik de Sentry-error handler toe aan mijn Express-applicatie. Deze zorgt ervoor dat Sentry fouten en prestaties kan monitoren:

```js
const Sentry = require("@sentry/node");

Sentry.setupExpressErrorHandler(app);

// Een algemene foutafhandelingsroute toevoegen
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
```

### Stap 9: Fouten Testen met Sentry

Voor het testen van de Sentry-integratie, voeg ik een route toe die opzettelijk een fout genereert:

```js
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
```

Ik start mijn Express-applicatie opnieuw op met node app.js en navigeer naar http://localhost:3000/debug-sentry. Deze foutmelding wordt nu opgevangen door Sentry en gerapporteerd in mijn Sentry-dashboard.

<img src="plaatjes/sentry-error-reporting.png" width="1015" alt="Sentry error reporting">

*Figuur 4: Error reporting in Sentry*

## Sentry in een CI/CD Workflow

Elke keer als ik een push doe naar de `main`-branch wil ik dat er automatisch testen worden gedraaid en een Sentry-rapport wordt gegenereerd waarin ik kan zien of er nog errors optreden voor een deploy. In deze sectie bespreek ik hoe ik Sentry kan integreren in mijn CI/CD-workflow met GitHub Actions. Aangezien mijn project momenteel op GitHub staat en ik al ervaring heb met GitHub Actions, kies ik ervoor om deze tool te gebruiken voor de automatisering van het build- en deployproces.

### Stap 1: GitHub Actions Workflow Configureren

Ik begin met het maken van een nieuwe workflow in mijn GitHub-repository. Dit doe ik door een bestand met de naam `.github/workflows/sentry.yml` aan te maken. Dit bestand definieert de stappen die GitHub Actions moet volgen.

Hier is een voorbeeld van de inhoud van mijn `sentry.yml`-bestand:

```yml
name: CI/CD with Sentry

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Change working directory
        run: cd ./src/my-sentry-app

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20' # De node-js versie die ik gebruik

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Send errors to Sentry
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
        run: |
          npx sentry-cli releases new $GITHUB_SHA
          npx sentry-cli releases set-commits --auto $GITHUB_SHA
          npx sentry-cli releases finalize $GITHUB_SHA

      - name: Send test errors to Sentry
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
        run: |
          npx sentry-cli send-event -m "Test errors during deployment" --level error
```

### Stap 2: Secrets Instellen

Om ervoor te zorgen dat mijn Sentry-integratie veilig is, moet ik enkele geheimen instellen in mijn GitHub-repository. Dit doe ik door naar het tabblad "Settings" van mijn repository te gaan, vervolgens naar "Secrets" en "Actions" en daar de volgende geheimen toe te voegen:
- SENTRY_AUTH_TOKEN: Dit is de authentificatietoken die ik van Sentry krijg. Hiermee kan ik veilig communiceren met de Sentry API.
- SENTRY_DSN: De Data Source Name die ik eerder heb ingesteld voor mijn Sentry-project.

### Workflow uitvoeren

Nu ik mijn workflow en geheimen heb ingesteld, wordt de workflow automatisch uitgevoerd telkens als ik een push doe naar de `main`-branch. GitHub Actions zal mijn code controleren, afhankelijkheden installeren, tests uitvoeren, en, als alles goed gaat, de release naar Sentry verzenden.

Als de tests echter falen, wordt er een foutmelding naar Sentry gestuurd met het bericht "Test errors during deployment". Dit stelt me in staat om eventuele problemen op te sporen voordat de code in productie wordt genomen, wat cruciaal is voor de softwarekwaliteit.

## Bronnen!


