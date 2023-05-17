import boto3
from decouple import config

s3_client = boto3.client(
    "s3",
    region_name="us-east-1",
)

S3_BUCKET = "vacay-assets"


def generate_presigned_url(username, file_name, file_type):
    if config("VACAY_BACKEND_ENV") == "local":
        return 'https://sample.s3.amazonaws.com'
    
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

def holidays(country):
    US = [
        {
            "name": "New Year's Day",
            "date": "2023-01-02",
        },
        {
            "name": "Martin Luther King Jr. Day",
            "date": "2023-01-16",
        },
        {
            "name": "Presidents' Day",
            "date": "2023-02-20",
        },
        {
            "name": "Independence Day",
            "date": "2023-07-04",
        },
        {
            "name": "Labor Day",
            "date": "2023-09-04",
        },
        {
            "name": "Columbus Day",
            "date": "2023-10-09",
        },
        {
            "name": "Veterans Day",
            "date": "2023-11-10",
        },
        {
            "name": "Thanksgiving Day",
            "date": "2023-11-23",
        },
        {
            "name": "Christmas Day",
            "date": "2023-12-25",
        },
        {
            "name": "Memorial Day",
            "date": "2023-05-29",
        }
        
    ]
    France = [
        {
            "name": "New Year's Day",
            "date": "2023-01-01",
        },
        {
            "name": "Easter Monday",
            "date": "2023-04-10",
        },
        {
            "name": "Labor Day",
            "date": "2023-05-01",
        },
        {
            "name": "Victory in Europe Day",
            "date": "2023-05-08",
        },
        {
            "name": "Ascension Day",
            "date": "2023-05-25",
        },
        {
            "name": "Whit Monday",
            "date": "2023-06-05",
        },{
            "name": "Whit Sunday (Pentecost)",
            "date": "2023-06-14",
        },
        {   
            "name":"National Day",
            "date": "2023-07-14",
        },{
            "name": "Assumption Day",
            "date": "2023-08-15",
        },{
            "name": "All Saints' Day",
            "date": "2023-11-01",
        },{
            "name": "Armistice Day",
            "date": "2023-11-11",
        },{
            "name": "Christmas Day",
            "date": "2023-12-25",
        }
    ]
    Others = [
        {
            "name": "New Year's Day",
            "date": "2023-01-01",
        },
        {
            "name": "Christmas Day",
            "date": "2023-12-25",
        }
    ]

    if country == 'United States':
        return US
    elif country == 'France':
        return France
    else:
        return Others