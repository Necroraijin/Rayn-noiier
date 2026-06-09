import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { s3Client } from "@/lib/aws"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    // Default to mock tenant 'rayn' if session context is uninitialized during development
    const tenantId = (session?.user as any)?.tenantId || "rayn"

    const { filename, fileType, caseId } = await req.json()
    if (!filename || !fileType) {
      return NextResponse.json({ error: "Missing required parameters: filename or fileType" }, { status: 400 })
    }

    const bucketName = process.env.AWS_S3_BUCKET || `${tenantId}-legal-docs-prod`
    const uniqueId = Math.random().toString(36).substring(2, 11)
    const fileKey = `tenants/${tenantId}/cases/${caseId || "unassigned"}/${uniqueId}-${filename}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: fileType,
    })

    // URL valid for 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })

    return NextResponse.json({
      uploadUrl,
      fileKey,
      bucket: bucketName,
    })
  } catch (error: any) {
    console.error("Failed to generate presigned S3 upload URL:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
