class TravelParser:

    COLUMN_ALIASES = {

        "distance": [
            "distance_km",
            "distance",
            "km",
        ],

        "travel_type": [
            "travel_type",
            "mode",
            "transport_type",
        ],

        "travel_date": [
            "travel_date",
            "date",
            "trip_date",
        ],

        "origin_airport": [
            "origin",
            "origin_airport",
            "from_airport",
        ],

        "destination_airport": [
            "destination",
            "destination_airport",
            "to_airport",
        ],
    }

    TRAVEL_TYPE_MAPPING = {

        "air": "Flight",

        "flight": "Flight",

        "train": "Train",

        "rail": "Train",
    }

    # =========================
    # SIMPLE AIRPORT DISTANCES
    # =========================

    AIRPORT_DISTANCES = {

        ("DEL", "BOM"): 1150,

        ("BOM", "DEL"): 1150,

        ("DEL", "BLR"): 1740,

        ("BLR", "DEL"): 1740,

        ("MAA", "DEL"): 1760,

        ("DEL", "MAA"): 1760,
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
                    "distance"
                ]
            )

            origin_airport = (
                self.get_value(
                    row,
                    self.COLUMN_ALIASES[
                        "origin_airport"
                    ]
                )
            )

            destination_airport = (
                self.get_value(
                    row,
                    self.COLUMN_ALIASES[
                        "destination_airport"
                    ]
                )
            )

            # =========================
            # AIRPORT DISTANCE FALLBACK
            # =========================

            if (
                not quantity
                and
                origin_airport
                and
                destination_airport
            ):

                quantity = (
                    self.AIRPORT_DISTANCES.get(
                        (
                            origin_airport.upper(),
                            destination_airport.upper(),
                        )
                    )
                )

            raw_travel_type = (
                self.get_value(
                    row,
                    self.COLUMN_ALIASES[
                        "travel_type"
                    ]
                )
            )

            mapped_type = (
                self.TRAVEL_TYPE_MAPPING.get(
                    str(raw_travel_type).lower(),
                    raw_travel_type
                )
            )

            is_flagged = False

            flag_reason = None

            # =========================
            # MISSING DISTANCE
            # =========================

            if not quantity:

                is_flagged = True

                flag_reason = (
                    "No distance or "
                    "airport codes provided"
                )

                quantity = 0

            records.append({

                "row_number": index,

                "scope": "scope_3",

                "category":
                    "Business Travel",

                "activity_type":
                    mapped_type,

                "quantity":
                    quantity,

                "unit":
                    "km",

                "occurred_on":
                    self.get_value(
                        row,
                        self.COLUMN_ALIASES[
                            "travel_date"
                        ]
                    ),

                "is_flagged":
                    is_flagged,

                "flag_reason":
                    flag_reason,
            })

        return records