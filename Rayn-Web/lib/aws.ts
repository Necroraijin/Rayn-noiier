import { S3Client } from "@aws-sdk/client-s3"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime"

const region = process.env.AWS_REGION || "us-east-1"

const credentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
} : undefined

export const s3Client = new S3Client({
  region,
  credentials,
})

export const dynamoClient = new DynamoDBClient({
  region,
  credentials,
})

export const bedrockClient = new BedrockRuntimeClient({
  region,
  credentials,
})
