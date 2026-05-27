UNIT_CONVERSIONS = {

    "L": ("L", 1.0),

    "kL": ("L", 1000.0),

    "gallon": ("L", 3.785),

    "kg": ("kg", 1.0),

    "tonne": ("kg", 1000.0),

    "m3": ("m3", 1.0),

    "kWh": ("kWh", 1.0),

    "MWh": ("kWh", 1000.0),

    "km": ("km", 1.0),

    "miles": ("km", 1.609),
}


def normalize_unit(
    quantity,
    unit
):

    if unit in UNIT_CONVERSIONS:

        normalized_unit, factor = (
            UNIT_CONVERSIONS[unit]
        )

        return (
            quantity * factor,
            normalized_unit
        )

    return quantity, unit