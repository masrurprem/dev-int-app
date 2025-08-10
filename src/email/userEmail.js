const { Resend } = require("resend");
const mailApi = "re_PgGVsySf_M6oV4y6tkfBVSvzwRtv8wZLW";
const resend = new Resend(mailApi);

// post registration welcome email
const sendWelcomeMail = (email, name) => {
  resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Welcome to the devInt Project",
    text: `Hello ${name}, share the experience of your last interview`,
  });
};

module.exports = { sendWelcomeMail };
