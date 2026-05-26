class SAPParser:

    def parse(self, rows):

        records = []

        for row in rows:

            records.append({

                "scope": "scope_1",

                "category": "Fuel Combustion",

                "activity_type": row.get(
                    "fuel_type"
                ),

                "quantity": row.get(
                    "quantity"
                ),

                "unit": row.get(
                    "unit"
                ),

                "occurred_on": row.get(
                    "transaction_date"
                ),
            })

        return records