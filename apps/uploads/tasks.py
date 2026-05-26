from apps.ingestion.parsers.sap_parser import SAPParser
from apps.ingestion.parsers.utility_parser import UtilityParser
from apps.ingestion.parsers.travel_parser import TravelParser

import csv
import requests

from io import StringIO

from celery import shared_task

from apps.uploads.models import UploadJob
from apps.esg.models import ESGRecord


@shared_task
def process_upload_job(upload_job_id):

    print("\n========================")
    print("TASK STARTED")
    print("========================\n")

    upload_job = UploadJob.objects.get(
        id=upload_job_id
    )

    upload_job.status = "processing"

    upload_job.save()

    try:

        file_url = upload_job.file

        print("FILE URL:")
        print(file_url)

        response = requests.get(file_url)

        csv_file = StringIO(response.text)

        reader = csv.DictReader(csv_file)

        rows = list(reader)

        print("\nRAW CSV ROWS:")
        print(rows)

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

        print("\nSELECTED PARSER:")
        print(upload_job.source_type)

        # =========================
        # PARSE DATA
        # =========================

        parsed_records = parser.parse(rows)

        print("\nPARSED RECORDS:")
        print(parsed_records)

        # =========================
        # PROCESS RECORDS
        # =========================

        for record in parsed_records:

            print("\nPROCESSING RECORD:")
            print(record)

            is_flagged = False

            flag_reason = None

            VALID_UNITS = [
                "L",
                "kg",
                "m3",
                "kWh",
                "km",
            ]

            quantity = record.get(
                "quantity"
            )

            print("\nRAW QUANTITY:")
            print(quantity)

            # =========================
            # SAFETY CHECK
            # =========================

            if quantity is None:

                print(
                    "\nQUANTITY IS NONE -> SKIPPING"
                )

                continue

            quantity = float(quantity)

            print("\nFLOAT QUANTITY:")
            print(quantity)

            # =========================
            # VALIDATIONS
            # =========================

            if (
                not record["activity_type"]
            ):

                is_flagged = True

                flag_reason = (
                    "Activity type missing"
                )

            elif (
                quantity <= 0
            ):

                is_flagged = True

                flag_reason = (
                    "Quantity must be "
                    "greater than 0"
                )

            elif (
                record["unit"]
                not in VALID_UNITS
            ):

                is_flagged = True

                flag_reason = (
                    f"Invalid unit: "
                    f"{record['unit']}"
                )

            print("\nVALIDATION STATUS:")
            print(is_flagged)
            print(flag_reason)

            # =========================
            # SIMPLE EMISSION ENGINE
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

            print("\nEMISSION FACTOR:")
            print(factor)

            co2e_emissions = (
                quantity * factor
            )

            print("\nCO2e:")
            print(co2e_emissions)

            ESGRecord.objects.create(

                company=upload_job.company,

                upload_job=upload_job,

                scope=record["scope"],

                category=record["category"],

                activity_type=record[
                    "activity_type"
                ],

                quantity=quantity,

                unit=record["unit"],

                normalized_unit=record[
                    "unit"
                ],

                co2e_emissions=co2e_emissions,

                source_reference=upload_job.original_file_name,

                occurred_on=record[
                    "occurred_on"
                ],

                review_status="pending",

                is_flagged=is_flagged,

                flag_reason=flag_reason,
            )

            print("\nRECORD SAVED SUCCESSFULLY")

        upload_job.status = "completed"

        upload_job.save()

        print("\nUPLOAD COMPLETED")

    except Exception as e:

        upload_job.status = "failed"

        upload_job.error_message = str(e)

        upload_job.save()

        print("\nERROR OCCURRED:")
        print(str(e))

        raise e