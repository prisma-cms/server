
import Payload from "@prisma-cms/prisma-processor";

// const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//   sendmail: true,
//   // host: smtp_config.host,
//   // port: smtp_config.port,
//   // secure: true, // true for 465, false for other ports
//   // auth: {
//   //     user: smtp_config.user, // generated ethereal user
//   //     pass: smtp_config.password,  // generated ethereal password
//   // }
// });


class Mailer extends Payload {

  objectType = "Letter";

  constructor(props) {

    const {
      ctx,
    } = props;

    super(ctx);

  }


  getConfig(){

    const {
      sendmail,
      MailerProps,
    } = this.ctx;

    let {
      mailSender,
      delay = 60000,
      ...other
    } = MailerProps || {};

    mailSender = mailSender || "no-reply@localhost";

    return {
      sendmail,
      mailSender,
      delay,
      ...other
    }
  }

  start() {

    this.sendLetters();

  }


  async sendLetters() {

    const {
      db,
    } = this.ctx;

    const {
      delay,
    } = this.getConfig();

    const letter = (await db.query.letters({
      first: 1,
      where: {
        status: "Created",
      },
    }))[0];

    console.log("sendLetters letter", letter);

    if (letter) {
      this.sendLetter(letter);
    }
    else {
      setTimeout(() => this.sendLetters(), delay);
    }

  }

  async sendLetter(letter) {


    const {
      id,
      email,
      subject,
      message,
    } = letter;


    await this.updateLetter(id, {
      status: "Processing",
    });

    await this.sendEmail(email, subject, message)
      .then(async r => {

        await this.updateLetter(id, {
          status: "Sended",
        });

        return r;
      })
      .catch(async error => {

        await this.updateLetter(id, {
          status: "Error",
        });

        // this.error(new Error("Error"));
        this.error(error);
      });
    ;

    this.sendLetters();

  }


  async updateLetter(id, data) {

    const {
      db,
    } = this.ctx;

    return await db.mutation.updateLetter({
      where: {
        id,
      },
      data,
    });
  }



  sendEmail = async (to, subject, message) => {


    // let simplesmtp = require("simplesmtp");

    // simplesmtp.connect(port[,host][, options]);


    // console.log("this.config", this.config);
    // console.log("stmp config", smtp_config);

    const {
      sendmail,
      mailSender = "no-reply@localhost",
      footer = "",
    } = this.getConfig();

    const host = process.env.HOST || "planner";


    return new Promise((resolve, reject) => {

      sendmail({
        from: mailSender,
        to,
        subject,
        html: `${message}
        <hr />
        ${footer}`,
      }, function(err, reply) {
        // console.log(err && err.stack);
        // console.dir(reply);
        if(err){
          reject(err);
        }
        else{
          resolve(true);
        }
      });

    });


 

  }

}

export default Mailer;