class TravelParser:

    def parse(self, rows):

        records = []

        for row in rows:

            quantity = row.get("distance_km")

            if not quantity:
                continue

            records.append({

                "scope": "scope_3",

                "category":
                    "Business Travel",

                "activity_type": row.get(
                    "travel_type"
                ),

                "quantity": quantity,

                "unit": "km",

                "occurred_on": row.get(
                    "travel_date"
                ),
            })

        return records