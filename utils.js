const fetch = require('node-fetch');
const { createTransport } = require('nodemailer');
const { fromString } = require('html-to-text');
const { readFile } = require('fs').promises;
const { join } = require('path');
const { compile } = require('handlebars');
const sdMail = require('@sendgrid/mail');

const formatMessage = (text, vars = []) => {
  let result = text;

  for (let index = 0; index < vars.length; index++) {
    const varItem = vars[index];
    const regex = new RegExp('\\*\\|' + varItem.name + '\\|\\*', 'g');
    result = result.replace(regex, varItem.content);
  }

  return result;
};

const sendWebhookNotification = async (url, text) => {
  const body = JSON.stringify({
    text,
    username: 'Security',
  }).replace(/\\\\n/g, '\\n');

  // Send Notification
  await fetch(url, {
    method: 'post',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
};

const sendMailNotification = async (subject, to, templateName, vars = {}, config) => {
  if (!config) {
    throw new Error('Config object is not found');
  }

  let emailData = await readFile(join(__dirname, 'templates', `${templateName}.hbs`));
  emailData = emailData.toString();

  const handlebarVars = {};

  if (vars) {
    for (let index = 0; index < vars.length; index++) {
      const item = vars[index];
      handlebarVars[item.name] = item.content;
    }
  }

  const html = compile(emailData)(handlebarVars);

  const mail = {
    from: '"Server Security" <no-reply@qlaffont.com>',
    to,
    subject,
    text: fromString(html),
    html,
  };

  if (config.sendgridApi) {
    sdMail.setApiKey(config.sendgridApi);

    await sdMail.send(mail);
  }

  if (config.smtpHost) {
    const transporter = createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 0,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPwd,
      },
    });

    await transporter.sendMail(mail);
  }
};

const getUserData = async ip => {
  return fetch(`https://ipinfo.io/${ip}/json`, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

const isEmailServiceActivated = process.env.MAIL_SMTP_HOST || process.env.MAIL_SMTP_SENDGRID_API ? true : false;

module.exports = {
  getUserData,
  formatMessage,
  sendWebhookNotification,
  sendMailNotification,
  isEmailServiceActivated,
};
