from datetime import datetime


SUPPORTED_DATE_FORMATS = [

    "%Y-%m-%d",

    "%d-%m-%Y",

    "%d/%m/%Y",

    "%Y/%m/%d",

    "%m/%d/%Y",
]


def parse_date(date_value):

    if not date_value:

        raise ValueError(
            "Date missing"
        )

    for fmt in SUPPORTED_DATE_FORMATS:

        try:

            return datetime.strptime(
                str(date_value).strip(),
                fmt
            ).date()

        except ValueError:

            continue

    raise ValueError(
        f"Invalid date format: "
        f"{date_value}"
    )