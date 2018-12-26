2.2.5
=====================================
- Get API schema relative path

2.2.4
=====================================
- Added yarn get-api-schema
- Added yarn build-api-fragments

2.2.3
=====================================
- Autodelete letters if Letter::deleteOnSend

2.2.2
=====================================
- Remove sendmail

2.2.1
=====================================
- Remove knex

2.2.0
=====================================
- StartServer refactoring

2.1.11
=====================================
- Upgrade dependencies

2.1.10
=====================================
- Fix imagesMiddleware

2.1.9
=====================================
- Upgrade dependencies
- Fix getApiSchema

2.1.8
=====================================
- Upgrade dependencies

2.1.7
=====================================
- Fix send mail

2.1.6
=====================================
- Upgrade dependencies

2.1.5
=====================================
- Upgrade @prisma-cms/prisma-context
- Remove prisma-binding

2.1.4
=====================================
- Upgrade graphql

2.1.3
=====================================
- Upgrade @prisma-cms/upload-module

2.1.1
=====================================
- Fix deploy errors handle

2.1.0
=====================================
- Breaking changes. Move modules Files, Letters, User, Logs into separated components.

2.0.2
=====================================
- Fix deploy schema

2.0.1
=====================================
- Fix get schema

2.0.0
=====================================
- Global code refactoring. Move to .mjs

1.6.7-beta
=====================================
- Upgrade @prisma-cms/prisma-context

1.6.6-beta
=====================================
- Added tests
- Added -D apollo-client
- Upgrade 
  - @prisma-cms/prisma-processor
  - @prisma-cms/prisma-module
  - graphql-import

1.6.5-beta
=====================================
- Upgrade @prisma-cms/prisma-uploads

1.6.4-beta
=====================================
- Upgrade @prisma-cms/prisma-context

1.6.3-beta
=====================================
- Fix dependencies

1.6.2-beta
=====================================
- Upgrade graphql@^14.0.2

1.6.1-beta
=====================================
- Fix getSchema

1.6.0-beta
=====================================
- New schema builder
- Breaking changes:
  - Removed prisma.yml
  - Removed .graphqlconfig
  - Deprecated npm scripts:
    - deploy-prod
    - build-schema-prisma
    - deploy-schema
    - get-schema
    - build-schema-api
    - build-schema
    - generate-fragments-api
    - voyager-prisma
    - voyager-app
  - Alternative scripts:
    - deploy - deploy all schemas with prisma deploy
    - deploy-force - deploy with force deleting nested data and relations in prisma database
    - build-api - generate API schema and fragments

1.5.2-beta
=====================================
- Fix API schema generation

1.5.1-beta
=====================================
- Upgrade packages

1.5.0-beta
=====================================
- Breaking changes: main /lib/index.js become /lib/server/index.js

1.4.0-beta
=====================================
- Code refactoring
- Ability use server itself

1.3.1-beta
=====================================
- Restore router modules

1.3.0-beta
=====================================
- Added api fragments generation
- Added Mailer server option
- Added MailerProps

### Example
```
MailerProps: {
  mailSender: "no-replay@my_host",
  footer: `<p>
    Regards!
  </p>`,
  delay: 15000,
}
```

1.2.0-beta
=====================================
- Added dev-server

1.1.19-beta
=====================================
- Upgrade @prisma-cms/prisma-uploads

1.1.18-beta
=====================================
- Upgrade @prisma-cms/prisma-uploads
- Install sharp@0.21.0

1.1.17-beta
=====================================
- Upgrade @prisma-cms/prisma-uploads

1.1.16-beta
=====================================
- Tests
- User::password return null

1.1.15-beta
=====================================
- Remove router modules
- Added tests

1.1.14-beta
=====================================
- Fix user update

1.1.12-beta
=====================================
- Tests

1.1.11-beta
=====================================
- Public release

1.1.10
=====================================
- Images middleware

1.1.9
=====================================
- Refactoring

1.1.1
=====================================
- Added userGroups query
