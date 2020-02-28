require('dotenv').config();

const { formatMessage, sendWebhookNotification, sendMailNotification, getUserData } = require('./utils');

(async () => {
  // Get User Information
  const data = await getUserData(process.env.IP);

  const templateVars = [
    {
      name: 'JAIL',
      content: process.env.JAIL,
    },
    {
      name: 'HOSTNAME',
      content: process.env.HOSTNAME,
    },
    {
      name: 'FAILURE',
      content: process.env.FAILURE,
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
      name: 'COUNTRYFLAG',
      content: data.country.toLowerCase(),
    },
    {
      name: 'DATE',
      content: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        minute: '2-digit',
        hour: '2-digit',
      }),
    },
  ];

  // Send slack notification
  if (process.env.WEBHOOK_URL) {
    let message =
      ':shield: **Fail2Ban Update** :shield: \n\nNew Ban on **|HOSTNAME|** (jail -> *|JAIL|*) ! \nIP: ***|IP|***\nDATE: *|DATE|*\n\nCOUNTRY: :flag_*|COUNTRYFLAG|*: ***|COUNTRY|*** \nCITY: *|CITY|*\n\nhttps://www.ip-tracker.org/locator/ip-lookup.php?ip=*|IP|*' ||
      process.env.WEBHOOK_MESSAGE;

    await sendWebhookNotification(process.env.WEBHOOK_URL, formatMessage(message, templateVars));
  }

  // Send Email
  if (process.env.MAIL_SMTP_HOST) {
    const {
      MAIL_SMTP_HOST,
      MAIL_SMTP_PORT,
      MAIL_SMTP_USER,
      MAIL_SMTP_PWD,
      MAIL_SMTP_TO,
      MAIL_SMTP_SENDGRID_API,
    } = process.env;

    await sendMailNotification(
      `New SSH Connection to ${process.env.HOSTNAME}`,
      MAIL_SMTP_TO,
      'fail2ban_ban',
      templateVars,
      {
        smtpHost: MAIL_SMTP_HOST,
        smtpPort: MAIL_SMTP_PORT,
        smtpUser: MAIL_SMTP_USER,
        smtpPwd: MAIL_SMTP_PWD,
        sendgridAPI: MAIL_SMTP_SENDGRID_API,
      },
    );
  }
})();
