from apps.ingestion.parsers.sap_parser import SAPParser
from apps.ingestion.parsers.utility_parser import UtilityParser
from apps.ingestion.parsers.travel_parser import TravelParser

from apps.common.utils import normalize_unit
from apps.common.date_utils import parse_date

import csv
import requests

from io import StringIO

from celery import shared_task

from apps.uploads.models import UploadJob
from apps.esg.models import ESGRecord


@shared_task
def process_upload_job(upload_job_id):

    upload_job = UploadJob.objects.get(
        id=upload_job_id
    )

    upload_job.status = "processing"

    upload_job.save()

    try:

        # =========================
        # FETCH FILE
        # =========================

        file_url = upload_job.file

        response = requests.get(
            file_url
        )

        csv_file = StringIO(
            response.text
        )

        reader = csv.DictReader(
            csv_file
        )

        rows = list(reader)

        # =========================
        # SELECT PARSER
        # =========================

        if upload_job.source_type == "sap":

            parser = SAPParser()

        elif upload_job.source_type == "utility":

            parser = UtilityParser()

        elif upload_job.source_type == "travel":

            parser = TravelParser()

        else:

            raise Exception(
                "Invalid source type"
            )

        # =========================
        # PARSE DATA
        # =========================

        parsed_records = parser.parse(
            rows
        )

        # =========================
        # EMISSION FACTORS
        # =========================

        EMISSION_FACTORS = {

            ("Diesel", "L"): 2.68,

            ("Diesel", "kg"): 3.18,

            ("Petrol", "L"): 2.31,

            ("Natural Gas", "m3"): 2.02,

            ("Electricity", "kWh"): 0.82,

            ("Flight", "km"): 0.15,

            ("Train", "km"): 0.05,
        }

        VALID_UNITS = [
            "L",
            "kg",
            "m3",
            "kWh",
            "km",
        ]

        # =========================
        # PROCESS RECORDS
        # =========================

        for record in parsed_records:

            try:

                # =========================
                # INITIAL FLAGS
                # =========================

                is_flagged = False

                flag_reason = None

                # =========================
                # MERGE PARSER FLAGS
                # =========================

                if record.get("is_flagged"):

                    is_flagged = True

                    flag_reason = record.get(
                        "flag_reason"
                    )

                row_number = record.get(
                    "row_number",
                    "unknown"
                )

                quantity = record.get(
                    "quantity"
                )

                unit = record.get(
                    "unit"
                )

                activity_type = record.get(
                    "activity_type"
                )

                # =========================
                # BASIC VALIDATION
                # =========================

                if quantity is None:

                    continue

                quantity = float(quantity)

                # =========================
                # DATE PARSING
                # =========================

                try:

                    occurred_on = parse_date(
                        record.get(
                            "occurred_on"
                        )
                    )

                except Exception:

                    occurred_on = None

                    is_flagged = True

                    if flag_reason:

                        flag_reason += (
                            "; Invalid date format"
                        )

                    else:

                        flag_reason = (
                            "Invalid date format"
                        )

                # =========================
                # UNIT NORMALIZATION
                # =========================

                normalized_quantity, normalized_unit = (
                    normalize_unit(
                        quantity,
                        unit
                    )
                )

                # =========================
                # VALIDATIONS
                # =========================

                if not activity_type:

                    is_flagged = True

                    if flag_reason:

                        flag_reason += (
                            "; Activity type missing"
                        )

                    else:

                        flag_reason = (
                            "Activity type missing"
                        )

                elif (
                    normalized_quantity <= 0
                ):

                    is_flagged = True

                    if flag_reason:

                        flag_reason += (
                            "; Quantity must be "
                            "greater than 0"
                        )

                    else:

                        flag_reason = (
                            "Quantity must be "
                            "greater than 0"
                        )

                elif (
                    normalized_unit
                    not in VALID_UNITS
                ):

                    is_flagged = True

                    if flag_reason:

                        flag_reason += (
                            f"; Invalid unit: "
                            f"{unit}"
                        )

                    else:

                        flag_reason = (
                            f"Invalid unit: "
                            f"{unit}"
                        )

                # =========================
                # EMISSION FACTOR LOOKUP
                # =========================

                factor = EMISSION_FACTORS.get(
                    (
                        activity_type,
                        normalized_unit
                    )
                )

                if factor is None:

                    is_flagged = True

                    if flag_reason:

                        flag_reason += (
                            "; No emission factor "
                            f"for {activity_type} "
                            f"with unit "
                            f"{normalized_unit}"
                        )

                    else:

                        flag_reason = (
                            "No emission factor for "
                            f"{activity_type} "
                            f"with unit "
                            f"{normalized_unit}"
                        )

                    factor = 0

                # =========================
                # EMISSION CALCULATION
                # =========================

                co2e_emissions = round(
                    normalized_quantity * factor,
                    2
                )

                # =========================
                # SAVE ESG RECORD
                # =========================

                ESGRecord.objects.create(

                    company=upload_job.company,

                    upload_job=upload_job,

                    scope=record["scope"],

                    category=record["category"],

                    activity_type=
                        activity_type,

                    quantity=quantity,

                    unit=unit,

                    normalized_quantity=
                        normalized_quantity,

                    normalized_unit=
                        normalized_unit,

                    co2e_emissions=
                        co2e_emissions,

                    source_reference=(
                        f"{upload_job.original_file_name}"
                        f" | row {row_number}"
                    ),

                    occurred_on=
                        occurred_on,

                    review_status="pending",

                    is_flagged=is_flagged,

                    flag_reason=flag_reason,
                )

            # =========================
            # ROW-LEVEL FAILURE
            # =========================

            except Exception as row_error:

                existing_error = (
                    upload_job.error_message
                    or ""
                )

                upload_job.error_message = (
                    existing_error
                    +
                    f"\nRow "
                    f"{record.get('row_number')}: "
                    f"{str(row_error)}"
                )

                upload_job.save()

                continue

        # =========================
        # JOB COMPLETED
        # =========================

        upload_job.status = "completed"

        upload_job.save()

    except Exception as e:

        upload_job.status = "failed"

        upload_job.error_message = str(e)

        upload_job.save()

        raise e