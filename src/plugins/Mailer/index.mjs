
import Payload from "@prisma-cms/prisma-processor";
import chalk from "chalk";


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
      orderBy: "rank_DESC",
    })
      .catch(error => {
        console.error(chalk.red("Mail plugin error"), error);
        throw error;
      });


    // console.log("sendLetters letters", letters);

    const letter = letters && letters[0];

    if (letter) {
      this.sendLetter(letter);
    }
    else {
      setTimeout(() => this.sendLetters(), delay);
    }

  }

  async sendLetter(letter) {

    // console.log(chalk.green("sendLetter letter"), letter);


    const {
      db,
    } = this.ctx;

    const {
      id,
      email,
      subject,
      message,
      deleteOnSend,
      replyTo,
      returnTo,
    } = letter;


    await this.updateLetter(id, {
      status: "Processing",
    });

    await this.sendEmail(email, subject, message, replyTo, returnTo)
      .then(async r => {

        await this.updateLetter(id, {
          status: "Sended",
        });

        return r;
      })
      .catch(async error => {

        console.error(chalk.red("Sendmail error"), error);

        await this.updateLetter(id, {
          status: "Error",
        });

        this.error(error);
      });
    ;

    if (deleteOnSend) {

      await db.mutation.deleteLetter({
        where: {
          id,
        },
      });

    }

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



  sendEmail(to, subject, message, replyTo, returnTo) {

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
        replyTo,
        returnTo,
      }, function (error, reply) {
        // console.dir(reply);
        if (error) {
          reject(error);
        }
        else {
          resolve(true);
        }
      });

    });

  }

}

export default Mailer;