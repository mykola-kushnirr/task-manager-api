const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const WelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Greetings!',
      text: `Welcome to the app, ${name}. Hope it will be useful for You.`,
    });
  } catch (e) {
    console.log(e);
  }
};

const AccCancelEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: 'kushnir.mykolaa@gmail.com',
      to: email,
      subject: 'Sorry to see you go.',
      text: `Dear ${name}. This email is to confirm that acc has been removed.\nWe would be pretty thankfull if you contact us back with telling the reason.\nThank you in advance and have a nice day.`,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  WelcomeEmail,
  AccCancelEmail,
};
