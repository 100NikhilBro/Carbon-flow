UNIT_CONVERSIONS = {

    # =========================
    # VOLUME
    # =========================

    "l": ("L", 1.0),

    "kl": ("L", 1000.0),

    "gallon": ("L", 3.785),

    # =========================
    # MASS
    # =========================

    "kg": ("kg", 1.0),

    "tonne": ("kg", 1000.0),

    # =========================
    # GAS
    # =========================

    "m3": ("m3", 1.0),

    # =========================
    # ELECTRICITY
    # =========================

    "kwh": ("kWh", 1.0),

    "mwh": ("kWh", 1000.0),

    # =========================
    # DISTANCE
    # =========================

    "km": ("km", 1.0),

    "miles": ("km", 1.609),
}


def normalize_unit(
    quantity,
    unit
):

    if unit is None:

        return quantity, unit

    # =========================
    # CLEAN UNIT
    # =========================

    cleaned_unit = (
        str(unit)
        .strip()
        .lower()
    )

    # =========================
    # NORMALIZE
    # =========================

    if cleaned_unit in UNIT_CONVERSIONS:

        normalized_unit, factor = (
            UNIT_CONVERSIONS[
                cleaned_unit
            ]
        )

        normalized_quantity = (
            quantity * factor
        )

        return (
            normalized_quantity,
            normalized_unit
        )

    # =========================
    # UNKNOWN UNIT
    # =========================

    return quantity, unit