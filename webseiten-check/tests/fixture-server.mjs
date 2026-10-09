// Local integration fixture only. Never used by the deployed application.
// Start: node tests/fixture-server.mjs
// Run a separate production preview with OPENAI_API_KEY=local-test-only,
// OPENAI_BASE_URL=http://127.0.0.1:3098/v1 and GOOGLE_SHEET_URL=http://127.0.0.1:3098/lead.
import { createServer } from 'node:http';
let leadRequests = 0;
createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  if (request.url === '/health') return response.end(JSON.stringify({ fixture: true, leadRequests }));
  let body = '';
  for await (const chunk of request) body += chunk;
  try {
    const data = JSON.parse(body);
    if (request.url === '/lead') {
      if (!data.email?.endsWith('@example.com')) {
        response.statusCode = 400;
        return response.end(JSON.stringify({ error: 'Only reserved example.com test addresses allowed.' }));
      }
      leadRequests += 1; // No personal information is retained.
      response.statusCode = data.email.startsWith('fail@') ? 503 : 200;
      return response.end(JSON.stringify({ success: response.statusCode === 200 }));
    }
    if (request.url === '/v1/chat/completions') {
      const input = JSON.parse(data.messages[1].content).prueftext;
      const quote = input.replace(/\s+/g, ' ').trim().split(' ').slice(0, 8).join(' ');
      const report = input.includes('MALFORMED') ? {} : {
        hauptproblem: 'TESTDATEN: Dieser erste Eindruck dient nur zur Prüfung der Ergebnisansicht.',
        analyseCards: input.includes('NO_SUGGESTIONS') ? [] : [{
          problemTitel: 'Testvorschlag',
          problemBeschreibung: 'TESTDATEN: Vergleich von Original und Entwurf.',
          vorher: quote,
          nachher: quote + ' – klar formuliert.',
          warumBesser: 'TESTDATEN: Hier steht später die Begründung der Textredaktion.',
        }],
      };
      return response.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(report) } }] }));
    }
    response.statusCode = 404;
    response.end('{}');
  } catch {
    response.statusCode = 400;
    response.end('{}');
  }
}).listen(3098, '127.0.0.1', () => console.log('Local test fixture: http://127.0.0.1:3098'));
