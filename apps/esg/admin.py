from django.contrib import admin

from apps.esg.models import ESGRecord


@admin.register(ESGRecord)
class ESGRecordAdmin(admin.ModelAdmin):

    list_display = (
        "company",
        "scope",
        "activity_type",
        "quantity",
        "unit",
        "co2e_emissions",
        "review_status",
        "is_flagged",
    )

    list_filter = (
        "scope",
        "review_status",
        "is_flagged",
    )

    search_fields = (
        "activity_type",
        "source_reference",
    )