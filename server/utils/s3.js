const { S3, BUCKET_NAME } = require('../config/s3');
const crypto = require('crypto');

exports.generateUploadUrl = async () => {
    const imageName = crypto.randomBytes(16).toString('hex');
    const params = ({
        Bucket: BUCKET_NAME,
        Key: imageName,
        Expires: 60
    });

    const uploadURL = await S3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}

exports.deleteObject = async key => {
    const params = ({ Bucket: BUCKET_NAME, Key: key });

    S3.deleteObject(params, (err, data) => {
        if (err) {
            console.error(err, err.stack);
            return ({ error: true });
        }
    });
}
