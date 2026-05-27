class SAPParser:

    COLUMN_ALIASES = {

        # =========================
        # FUEL TYPE
        # =========================

        "fuel_type": [
            "fuel_type",
            "fuel",
            "fuel name",
            "material",
            "matkl",
        ],

        # =========================
        # QUANTITY
        # =========================

        "quantity": [
            "quantity",
            "qty",
            "amount",
            "menge",
        ],

        # =========================
        # UNIT
        # =========================

        "unit": [
            "unit",
            "uom",
            "meins",
        ],

        # =========================
        # DATE
        # =========================

        "transaction_date": [
            "transaction_date",
            "date",
            "txn_date",
            "budat",
        ],

        # =========================
        # PLANT
        # =========================

        "plant_code": [
            "plant",
            "werks",
            "plant_code",
        ],
    }

    # =========================
    # SAMPLE PLANT LOOKUP
    # =========================

    VALID_PLANTS = {

        "PLANT_1000": "Delhi Plant",

        "PLANT_2000": "Mumbai Plant",

        "PLANT_3000": "Bangalore Plant",
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

            fuel_type = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "fuel_type"
                ]
            )

            quantity = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "quantity"
                ]
            )

            unit = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "unit"
                ]
            )

            transaction_date = (
                self.get_value(
                    row,
                    self.COLUMN_ALIASES[
                        "transaction_date"
                    ]
                )
            )

            plant_code = self.get_value(
                row,
                self.COLUMN_ALIASES[
                    "plant_code"
                ]
            )

            # =========================
            # CLEAN UNIT
            # =========================

            if unit:

                unit = (
                    unit
                    .strip()
                    .lower()
                )

            # =========================
            # PLANT VALIDATION
            # =========================

            is_flagged = False

            flag_reason = None

            if (
                plant_code
                and
                plant_code
                not in self.VALID_PLANTS
            ):

                is_flagged = True

                flag_reason = (
                    f"Unknown plant code: "
                    f"{plant_code}"
                )

            records.append({

                "row_number": index,

                "scope": "scope_1",

                "category":
                    "Fuel Combustion",

                "activity_type":
                    fuel_type,

                "quantity":
                    quantity,

                "unit":
                    unit,

                "occurred_on":
                    transaction_date,

                "plant_code":
                    plant_code,

                "is_flagged":
                    is_flagged,

                "flag_reason":
                    flag_reason,
            })

        return records