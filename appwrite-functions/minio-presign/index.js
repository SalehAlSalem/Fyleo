/**
 * Appwrite Function: minio-presign
 * Actions:
 *  - getUploadUrl: returns presigned PUT URL and objectName
 *  - getDownloadUrl: returns presigned GET URL for an object
 *  - deleteObject: deletes an object from the bucket
 *
 * ENV required:
 *  - MINIO_ENDPOINT
 *  - MINIO_PORT
 *  - MINIO_USE_SSL ("true" | "false")
 *  - MINIO_ACCESS_KEY
 *  - MINIO_SECRET_KEY
 *  - MINIO_BUCKET_NAME
 */

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

function uniqueName(base) {
  const ext = (base && base.includes('.')) ? base.split('.').pop() : '';
  const id = crypto.randomBytes(12).toString('hex');
  return ext ? `${id}.${ext}` : id;
}

function getClient() {
  const endpoint = process.env.MINIO_ENDPOINT;
  const port = process.env.MINIO_PORT || '9000';
  const useSSL = String(process.env.MINIO_USE_SSL || 'true') === 'true';
  const accessKeyId = process.env.MINIO_ACCESS_KEY;
  const secretAccessKey = process.env.MINIO_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('MinIO env vars are missing');
  }

  const protocol = useSSL ? 'https' : 'http';
  const endpointUrl = `${protocol}://${endpoint}:${port}`;

  return new S3Client({
    endpoint: endpointUrl,
    region: 'us-east-1',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true
  });
}

module.exports = async ({ req, res, log, error }) => {
  try {
    const bucket = process.env.MINIO_BUCKET_NAME;
    if (!bucket) {
      return res.json({ error: 'MINIO_BUCKET_NAME not set' }, 500);
    }

    const minio = getClient();

    let body = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch (e) {
      return res.json({ error: 'Invalid JSON body' }, 400);
    }

    const action = body.action || 'getUploadUrl';

    if (action === 'getUploadUrl') {
      const fileName = body.fileName || 'file.bin';
      const contentType = body.contentType || 'application/octet-stream';

      const objectName = uniqueName(fileName);
      
      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: objectName,
        ContentType: contentType
      });
      const uploadUrl = await getSignedUrl(minio, putCommand, { expiresIn: 3600 });
      
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: objectName
      });
      const downloadUrl = await getSignedUrl(minio, getCommand, { expiresIn: 3600 });

      return res.json({ uploadUrl, objectName, downloadUrl }, 200);
    }

    if (action === 'getDownloadUrl') {
      const objectName = body.objectName;
      if (!objectName) return res.json({ error: 'objectName is required' }, 400);
      
      // Extract filename from objectName or use default
      const fileName = body.fileName || objectName.split('/').pop();
      
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: objectName,
        ResponseContentDisposition: `attachment; filename="${fileName}"`
      });
      const downloadUrl = await getSignedUrl(minio, getCommand, { expiresIn: 3600 });
      return res.json({ downloadUrl }, 200);
    }

    if (action === 'deleteObject') {
      const objectName = body.objectName;
      if (!objectName) return res.json({ error: 'objectName is required' }, 400);
      
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: objectName
      });
      await minio.send(deleteCommand);
      return res.json({ deleted: true }, 200);
    }

    return res.json({ error: 'Unknown action' }, 400);
  } catch (e) {
    error('[minio-presign] Function error:', e);
    return res.json({ error: e.message || 'Internal error' }, 500);
  }
};
