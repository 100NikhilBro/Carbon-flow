from apps.ingestion.parsers.sap_parser import SAPParser
from apps.ingestion.parsers.utility_parser import UtilityParser
from apps.ingestion.parsers.travel_parser import TravelParser

from apps.common.utils import normalize_unit

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
        # PROCESS RECORDS
        # =========================

        for record in parsed_records:

            is_flagged = False

            flag_reason = None

            quantity = record.get(
                "quantity"
            )

            unit = record.get(
                "unit"
            )

            # =========================
            # SAFETY CHECKS
            # =========================

            if quantity is None:

                continue

            quantity = float(quantity)

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
            # VALIDATION
            # =========================

            VALID_UNITS = [
                "L",
                "kg",
                "m3",
                "kWh",
                "km",
            ]

            if (
                not record["activity_type"]
            ):

                is_flagged = True

                flag_reason = (
                    "Activity type missing"
                )

            elif (
                normalized_quantity <= 0
            ):

                is_flagged = True

                flag_reason = (
                    "Quantity must be "
                    "greater than 0"
                )

            elif (
                normalized_unit
                not in VALID_UNITS
            ):

                is_flagged = True

                flag_reason = (
                    f"Invalid unit: "
                    f"{unit}"
                )

            # =========================
            # EMISSION FACTORS
            # =========================

            EMISSION_FACTORS = {

                "Diesel": 2.5,

                "Petrol": 2.3,

                "Natural Gas": 2.0,

                "Electricity": 0.8,

                "Flight": 0.15,

                "Train": 0.05,
            }

            factor = EMISSION_FACTORS.get(
                record["activity_type"],
                1
            )

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

                activity_type=record[
                    "activity_type"
                ],

                quantity=quantity,

                unit=unit,

                normalized_quantity=
                    normalized_quantity,

                normalized_unit=
                    normalized_unit,

                co2e_emissions=
                    co2e_emissions,

                source_reference=
                    upload_job.original_file_name,

                occurred_on=record[
                    "occurred_on"
                ],

                review_status="pending",

                is_flagged=is_flagged,

                flag_reason=flag_reason,
            )

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