# Serverless API For Personal Journal

Simple Node Express API service, backed by DynamoDB database, running on AWS Lambda using the traditional Serverless Framework. \
Followed [Alex DeBrie - serverless-express-rest-api](https://www.serverless.com/blog/serverless-express-rest-api)

## Usage

### Deployment

This api is made to work with the Serverless Framework dashboard, which includes advanced features such as CI/CD, monitoring, metrics, etc.

In order to deploy with dashboard, you need to first login with:

```zsh
serverless login
```

install dependencies with:

```zsh
npm install
```

and then perform deployment with:

```zsh
serverless deploy
```

### Invocation

After successful deployment, you can create a new entry log by calling the corresponding endpoint:

```zsh
curl --request POST 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev/entrylogs' --header 'Content-Type: application/json' --data-raw '{"name": "John", "entrylogID": "someEntrylogID"}'
```

Which should result in the following response:

```zsh
{"entrylogID":"someEntrylogID","name":"John"}
```

You can later retrieve the entry log by `entrylogID` by calling the following endpoint:

```zsh
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev/entrylogs/someEntrylogID
```

Which should result in the following response:

```zsh
{"entrylogID":"someEntrylogID","name":"John"}
```

If you try to retrieve entry log that does not exist, you should receive the following response:

```zsh
{"error":"Could not find entry log with provided \"entrylogID\""}
```

<!-- 
### Local development

After that, running the following command with start both local API Gateway emulator as well as local instance of emulated DynamoDB:

```zsh
serverless offline start
```

```zsh
serverless dev
```
 -->

## Resources

[Serverless Components](https://github.com/serverless/components)
[Austen Collins - Serverless Express](https://www.serverless.com/blog/serverless-express-apis-aws-lambda-http-api)
[Brian Neisler - what-are-serverless-components-how-use](https://www.serverless.com/blog/what-are-serverless-components-how-use)

To learn more about the capabilities of `serverless-offline` and `serverless-dynamodb-local`, please refer to their corresponding GitHub repositories:
[Serverless offline](https://github.com/dherault/serverless-offline)
[Serverless dynamodb-local](https://github.com/99x/serverless-dynamodb-local)
