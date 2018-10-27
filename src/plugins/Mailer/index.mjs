
import Payload from "@prisma-cms/prisma-processor";


class Mailer extends Payload {



  constructor(props) {

    const {
      ctx,
    } = props;

    super(ctx);

    this.objectType = "Letter";

    this.sendEmail = this.sendEmail.bind(this)

  }


  getConfig() {

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


    const letters = await db.query.letters({
      first: 1,
      where: {
        status: "Created",
      },
    });


    // console.log("sendLetters letters", letters);

    const letter = letters && letters[0];

    // console.log("sendLetters letter", letter);

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



  sendEmail(to, subject, message) {

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
      }, function (err, reply) {
        // console.log(err && err.stack);
        // console.dir(reply);
        if (err) {
          reject(err);
        }
        else {
          resolve(true);
        }
      });

    });




  }

}

export default Mailer;