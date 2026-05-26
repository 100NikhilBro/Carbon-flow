class UtilityParser:

    def parse(self, rows):

        records = []

        for row in rows:

            quantity = row.get("kwh")

            if not quantity:
                continue

            records.append({

                "scope": "scope_2",

                "category":
                    "Purchased Electricity",

                "activity_type":
                    "Electricity",

                "quantity": quantity,

                "unit": "kWh",

                "occurred_on": row.get(
                    "bill_month"
                ),
            })

        return records