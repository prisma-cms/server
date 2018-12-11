# @prisma-cms/server
See [instruction](https://github.com/prisma-cms/boilerplate#readme) for install.

### Deploy schema
endpoint=http://localhost:4466/{project}/{stage} yarn deploy

### Start server
endpoint=http://localhost:4466/{project}/{stage} yarn start

### Attention! node-js 10+ required

## Get remote API schema and build graphql fragments
yarn get-api-schema --endpoint, -e Endpoint name or URL
yarn build-api-fragments
