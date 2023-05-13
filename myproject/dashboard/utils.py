import boto3

s3_client = boto3.client(
    "s3",
    region_name="us-east-1",
)

S3_BUCKET = "vacay-assets"


def generate_presigned_url(username, file_name, file_type):
    path = f"users/{username}/profile/{file_name}"

    url = s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": S3_BUCKET,
            "Key": path,
            "ContentType": file_type,
        },
        ExpiresIn=360,
    )
    return url
