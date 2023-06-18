from decouple import config

S3_BUCKET = config('S3_BUCKET')

AWS_REGION = config('AWS_REGION')

US = [
        {
            "name": "New Year's Day",
            "date": "2024/01/01"
        },
        {
            "name": "Martin Luther King Jr. Day",
            "date": "2024/01/16"
        },
        {
            "name": "Presidents' Day",
            "date": "2024/02/20"
        },
        {
            "name": "Independence Day",
            "date": "2023/07/04"
        },
        {
            "name": "Labor Day",
            "date": "2023/09/04"
        },
        {
            "name": "Columbus Day",
            "date": "2023/10/09"
        },
        {
            "name": "Veterans Day",
            "date": "2023/11/10"
        },
        {
            "name": "Thanksgiving Day",
            "date": "2023/11/23"
        },
        {
            "name": "Christmas Day",
            "date": "2023/12/25"
        },
        {
            "name": "Memorial Day",
            "date": "2023/05/29"
        }
    ]

FRANCE = [
    {
        "name": "New Year's Day",
        "date": "2024/01/01"
    },
    {
        "name": "Easter Monday",
        "date": "2024/04/10"
    },
    {
        "name": "Labor Day",
        "date": "2023/05/01"
    },
    {
        "name": "Victory in Europe Day",
        "date": "2023/05/08"
    },
    {
        "name": "Ascension Day",
        "date": "2023/05/25"
    },
    {
        "name": "Whit Monday",
        "date": "2023/06/05"
    }, {
        "name": "Whit Sunday (Pentecost)",
        "date": "2023/06/14"
    },
    {
        "name": "National Day",
        "date": "2023/07/14"
    },
    {
        "name": "Assumption Day",
        "date": "2023/08/15"
    },
    {
        "name": "All Saints' Day",
        "date": "2023/11/01"
    },
    {
        "name": "Armistice Day",
        "date": "2023/11/11"
    },
    {
        "name": "Christmas Day",
        "date": "2023/12/25"
    }
]

OTHERS = [
        {
            "name": "New Year's Day",
            "date": "2024/01/01"
        },
        {
            "name": "Christmas Day",
            "date": "2023/12/25"
        }
    ]
