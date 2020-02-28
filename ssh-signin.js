require('dotenv').config();

const fetch = require('node-fetch');
const formatMessage = require('./utils');

(async () => {
  // Get User Information
  const data = await fetch(`ipinfo.io/` + process.env.IP, {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());

  if (process.env.WEBHOOK_URL) {
    let message =
      ':police_officer: **Security Update** :police_officer: \n\n :inbox_tray:  New SSH Connection on **|HOSTNAME|**! \nIP: *|IP|*\nDATE: *|DATE|*\n\nCOUNTRY: :flag_*|COUNTRY|*: ***|COUNTRY|*** \nCITY: *|CITY|*';

    if (process.env.WEBHOOK_MESSAGE) {
      message = process.env.WEBHOOK_MESSAGE;
    }

    const templateVars = [
      {
        name: 'IP',
        content: process.env.IP,
      },
      {
        name: 'HOSTNAME',
        content: process.env.HOSTNAME,
      },
      {
        name: 'CITY',
        content: data.city,
      },
      {
        name: 'COUNTRY',
        content: data.country,
      },
      {
        name: 'DATE',
        content: new Date().toLocaleDateString(),
      },
    ];

    const body = JSON.stringify({
      text: formatMessage(message, templateVars),
      username: 'Security',
    }).replace(/\\\\n/g, '\\n');

    // Send Notification
    await fetch(process.env.WEBHOOK_URL, {
      method: 'post',
      body,
      headers: { 'Content-Type': 'application/json' },
    });
  }
})();
