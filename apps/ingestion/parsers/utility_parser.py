class UtilityParser:

    COLUMN_ALIASES = {

        "kwh": [
            "kwh",
            "electricity_kwh",
            "usage_kwh",
            "consumption",
        ],

        "unit": [
            "unit",
            "uom",
        ],

        "bill_month": [
            "bill_month",
            "billing_date",
            "invoice_date",
        ],

        "start_read": [
            "start_read",
            "start_meter",
            "opening_read",
        ],

        "end_read": [
            "end_read",
            "end_meter",
            "closing_read",
        ],

        "start_date": [
            "start_date",
            "billing_start",
        ],

        "end_date": [
            "end_date",
            "billing_end",
        ],
    }

    def get_value(
        self,
        row,
        possible_columns
    ):

        for column in possible_columns:

            value = row.get(column)

            if value:

                return str(value).strip()

        return None

    def parse(self, rows):

        records = []

        for index, row in enumerate(
            rows,
            start=1
        ):

            quantity = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "kwh"
                ]
            )

            unit = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "unit"
                ]
            )

            start_read = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "start_read"
                ]
            )

            end_read = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "end_read"
                ]
            )

            # =========================
            # METER READ CALCULATION
            # =========================

            if (
                not quantity
                and
                start_read
                and
                end_read
            ):

                try:

                    quantity = (
                        float(end_read)
                        -
                        float(start_read)
                    )

                except Exception:

                    quantity = 0

            # =========================
            # DEFAULT UNIT
            # =========================

            if not unit:

                unit = "kWh"

            # =========================
            # MWH → KWH
            # =========================

            if (
                str(unit).strip().lower()
                == "mwh"
            ):

                try:

                    quantity = (
                        float(quantity)
                        * 1000
                    )

                    unit = "kWh"

                except Exception:

                    quantity = 0

            # =========================
            # MISSING CONSUMPTION
            # =========================

            is_flagged = False

            flag_reason = None

            if quantity is None:

                is_flagged = True

                flag_reason = (
                    "Missing electricity "
                    "consumption"
                )

                quantity = 0

            # =========================
            # OCCURRED DATE
            # =========================

            occurred_on = (

                self.get_value(
                    row,
                    self.COLUMN_ALIASES[
                        "end_date"
                    ]
                )

                or

                self.get_value(
                    row,
                    self.COLUMN_ALIASES[
                        "bill_month"
                    ]
                )
            )

            records.append({

                "row_number": index,

                "scope": "scope_2",

                "category":
                    "Purchased Electricity",

                "activity_type":
                    "Electricity",

                "quantity":
                    quantity,

                "unit":
                    unit,

                "occurred_on":
                    occurred_on,

                "is_flagged":
                    is_flagged,

                "flag_reason":
                    flag_reason,
            })

        return records