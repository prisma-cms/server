

import Processor from "@prisma-cms/prisma-processor";

import shortid from "shortid";

import PrismaModule from "@prisma-cms/prisma-module";

import isemail from "isemail";

import bcrypt from "bcryptjs";
 
import jwt from "jsonwebtoken";


const cleanUpPhone = function (phone) {

  if (phone) {

    phone = phone.trim().replace(/[^0-9]/g, '');

    if (!phone) {
      phone = undefined;
    }

    else if (phone.length === 10) {
      phone = '7' + phone;
    }

  }

  return phone;
}


const createPassword = async (password) => {

  if (!password) {
    throw (new Error("Пароль не может быть пустым"));
  }

  return await bcrypt.hash(password, 10);
}


class UserPayload extends Processor {
 

  constructor(ctx) {

    super(ctx);

    this.objectType = "User";

  }

  async signin(source, args, ctx, info) {


    const {
      where,
      password,
    } = args;


    const {
      db,
    } = ctx;


    const user = await db.query.user({
      where,
    });


    if (!user) {
      this.addFieldError("username", "Пользователь не был найден");
    }
    else if (!user.password || !await bcrypt.compare(password, user.password)) {

      this.addFieldError("password", "Неверный пароль");
    }


    let token;

    if (!this.hasErrors()) {
      this.data = user;

      token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    }


    const result = this.prepareResponse();

    if (user) {
      db.mutation.updateUser({
        data: {
          LogedIns: {
            create: {},
          },
          activated: true,
        },
        where: {
          id: user.id,
        },
      });
    }

    return {
      ...result,
      token,
    }

  }


  async signup(method, source, args, ctx, info) {

    let {
      data: {
        username,
        fullname,
        email,
        password,
        ...data
      },
    } = args;

    const {
      db,
    } = ctx;

    let token;


    if (!password) {
      this.addFieldError("password", "Type password");
    }


    if (!username) {
      // this.addFieldError("username", "Укажите логин");
    }
    else if (isemail.validate(username)) {
      this.addFieldError("username", "Please, do not set email as username");
    }
    // Проверяем есть ли пользователь с таким ником
    else if (await db.query.user({
      where: {
        username,
      },
    })) {
      // throw ("Пользователь с таким логином уже зарегистрирован");
      this.addFieldError("username", "Username already exists");
    }

    // Проверяем есть ли пользователь с таким емейлом
    if (!email) {
      // this.addFieldError("email", "Укажите емейл");
    }
    else if (!isemail.validate(email)) {

      this.addFieldError("email", "Please, type correct email");

    }
    else if (await db.query.user({
      where: {
        email,
      },
    })) {
      // throw ("Пользователь с таким емейлом уже зарегистрирован");
      this.addFieldError("email", "Email already exists");
    }


    if (!this.hasErrors()) {

      password = await createPassword(password);

      await this.mutate("createUser", {
        data: {
          ...data,
          username,
          fullname,
          email,
          password,
          active: true,
          activated: true,
          LogedIns: {
            create: {},
          },
        },
      })
        .then(user => {

          this.data = user;

          const {
            id: userId,
          } = user || {}

          if (userId) {
            token = jwt.sign({
              userId,
            }, process.env.APP_SECRET)
          }

          return user;
        })
        .catch(e => {
          console.error("signup error", e);
          return e;
        });

    }


    const result = this.prepareResponse();

    return {
      ...result,
      token,
    }

  }


  async create(objectType, args, info) {



    const {
      db,
    } = this.ctx;

    let {
      data: {
        username,
        password,
        email,
        fullname,
        ...data
      },
    } = args;


    const currentUser = await this.getUser();

    if (!currentUser) {
      throw (new Error("Необходимо авторизоваться"));
    }

    const {
      id: currentUserId,
    } = currentUser;

    data.CreatedBy = {
      connect: {
        id: currentUserId,
      },
    }


    if (!fullname) {
      this.addFieldError("fullname", "Укажите ФИО");
    }


    if (password === undefined) {
      password = await createPassword(await shortid.generate());
    }
    else if (!password) {
      this.addFieldError("password", "Пароль не может быть пустым");
    }

    if (username !== undefined) {
      if (!username) {
        this.addFieldError("username", "Укажите логин");
      }
      else if (isemail.validate(username)) {
        this.addFieldError("username", "Не указывайте емейл в качестве логина, заспамят.");
      }
      // Проверяем есть ли пользователь с таким ником
      else if (await db.query.user({
        where: {
          username,
        },
      })) {
        // throw ("Пользователь с таким логином уже зарегистрирован");
        this.addFieldError("username", "Пользователь с таким логином уже зарегистрирован");
      }
    }

    // Проверяем есть ли пользователь с таким емейлом
    if (email) {
      // this.addFieldError("email", "Укажите емейл");

      if (!isemail.validate(email)) {

        this.addFieldError("email", "Укажите корректный емейл");

      }
      else if (await db.query.user({
        where: {
          email,
        },
      })) {
        // throw ("Пользователь с таким емейлом уже зарегистрирован");
        this.addFieldError("email", "Пользователь с таким емейлом уже зарегистрирован");
      }

    }




    data.password = password;

    args.data = {
      ...data,
      username,
      password,
      email,
      fullname,
    };

    return super.create(objectType, args, info);
  }


  async update(objectType, args, info) {

    // const userId = await getUserId(this.ctx);

    let {
      data: {
        password,
        sudo,
        Groups,
        birthday,
        ...data
      },
      where = {},
      id,
    } = args;


    if (password !== undefined) {

      if (password) {
        password = await createPassword(password);
      }
      else {
        password = undefined;
      }

    }



    const {
      db,
    } = this.ctx;


    if (id) {
      where = {
        id,
      }
    }


    const currentUser = await this.getUser();


    if (!this.hasErrors()) {

      let user;

      if (Object.keys(where).length) {
        user = await this.query("user", {
          where,
        });
      }
      else {
        user = currentUser;
      }

      if (!user) {
        this.addError("Не был получен пользователь");
      }
      else {

        if (currentUser.sudo === true) {

          Object.assign(data, {
            sudo,
            Groups,
          });

        }
        else {

          /**
           * Если обновляемый пользователь не текущий, то проверяем права это делать
           */
          if (user.id !== currentUser.id) {

            this.addError("Нет прав");

          }

        }




        return super.update(objectType,
          {
            where: {
              id: user.id,
            },
            data: {
              ...data,
              password,
            },
          },
          // info,
        );
      }

    }


    // return this.prepareResponse();
  }


  async mutate(method, args, info) {

    // return super.mutate(method, args, info);

    let {
      data: {
        phone,
        email,
        ...data
      },
      ...otherArgs
    } = args;


    if (phone) {
      phone = cleanUpPhone(phone);
    }

    if (email !== undefined) {
      email = email && email.trim("").toLowerCase() || null;
    }

    data = {
      ...data,
      phone,
      email,
    }

    return super.mutate(method, {
      data,
      ...otherArgs
    });

  }

}



const signup = async function (source, args, ctx, info) {

  return (new UserPayload(ctx)).signup("userCreate", source, args, ctx, info);
}

const signin = async function (source, args, ctx, info) {

  return new UserPayload(ctx).signin(source, args, ctx, info);
}



const usersConnection = async function (parent, args, ctx, info) {

  let {
    where: argsWhere,
  } = args


  let {
    phone,
    OR,
    ...where
  } = argsWhere || {}

  if (phone) {

    phone = cleanUpPhone(phone);

  }

  if (OR) {

    let phoneField = OR.find(n => Object.keys(n).indexOf("phone") !== -1);


    if (phoneField && phoneField.phone) {
      phoneField.phone = cleanUpPhone(phoneField.phone);
    }

  }


  Object.assign(args, {
    where: {
      ...where,
      phone,
      OR,
    },
  });

  return ctx.db.query.usersConnection(args, info);

}

const users = function (parent, args, ctx, info) {

  return ctx.db.query.users({}, info);

}

const user = async function (parent, args, ctx, info) {


  return ctx.db.query.user({

  }, info);
}


const me = async function (parent, args, ctx, info) {

  return ctx.currentUser;
}

const updateUserProcessor = async function (source, args, ctx, info) {

  return new UserPayload(ctx).updateWithResponse("User", args, info);
}


/**
 * Сброс пароля.
 * Так как у пользователей может не быть указан емейл,
 * то пароль сбрасываем только при наличии емейла.
 * 
 * ToDo сделать отправку сообщений через смс
 */
const resetPassword = async function (source, args, ctx, info) {

  const {
    db,
  } = ctx;

  const {
    where,
  } = args;


  const user = await db.query.user({
    where,
  })
    ;


  if (!user) {
    throw (new Error("Не был получен пользователь"));
  }


  const {
    id,
    email,
  } = user;

  if (!email) {
    throw (new Error("У пользователя не указан емейл"));
  }


  const password = shortid.generate();
  const passwordHash = await createPassword(password);

  const result = await db.mutation.updateUser({
    where: {
      id,
    },
    data: {
      password: passwordHash,
    },
  });

  // Создаем новое сообщение
  db.mutation.createLetter({
    data: {
      email,
      subject: "Новый пароль",
      message: `<h3>Ваш новый пароль</h3>
        <p>
          Логин: ${email}
        </p>
        <p>
          Пароль: ${password}
        </p>
      `,
    },
  });


  if (result) {
  }
  else {
    throw (new Error("Ошибка сброса пароля"));
  }

  return true;
}

const createUserProcessor = async function (source, args, ctx, info) {

  return new UserPayload(ctx).createWithResponse("User", args, info);
}


const userPayloadData = {
  data: (source, args, ctx, info) => {

    const {
      id,
    } = source.data || {};

    return id ? ctx.db.query.user({
      where: {
        id,
      },
    }, info) : null;
  }
}


const User = {

  LogedIns: (source, args, ctx, info) => {


    const {
      LogedIns,
    } = source;

    const {
      sudo,
    } = ctx.currentUser || {};


    return sudo ? LogedIns : [];

  },

  email: (source, args, ctx, info) => {

    const {
      id,
      email,
      showEmail,
    } = source;

    const {
      id: currentUserId,
      sudo,
    } = ctx.currentUser || {};

    return (id === currentUserId) || showEmail || sudo ? email : null;

  },

  phone: (source, args, ctx, info) => {

    const {
      id,
      phone,
      showPhone,
    } = source;

    const {
      id: currentUserId,
      sudo,
    } = ctx.currentUser || {};

    return id === currentUserId || showPhone || sudo ? phone : null;

  },

  hasEmail: (source, args, ctx, info) => {

    const {
      email,
    } = source;

    return email ? true : false;

  },

  hasPhone: (source, args, ctx, info) => {

    const {
      phone,
    } = source;

    return phone ? true : false;

  },

  password: () => null,
}


const userGroups = function (source, args, ctx, info) {

  const {
    currentUser,
  } = ctx;


  const {
    sudo,
  } = currentUser || {};

  return sudo ? ctx.db.query.userGroups({}, info) : [];

}



export default class UsersModule extends PrismaModule {


  getResolvers() {


    const resolvers = super.getResolvers();


    Object.assign(resolvers.Query, {
      users,
      usersConnection,
      user,
      me,
      userGroups,
    });


    Object.assign(resolvers.Mutation, {
      signin,
      signup,
      createUserProcessor,
      updateUserProcessor,
      resetPassword,
    });




    Object.assign(resolvers, {
      UserResponse: userPayloadData,
      AuthPayload: userPayloadData,
      User,
    });


    return resolvers;
  }


}



