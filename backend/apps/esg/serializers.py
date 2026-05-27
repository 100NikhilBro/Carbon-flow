from rest_framework import serializers

from apps.esg.models import ESGRecord


class ESGRecordSerializer(
    serializers.ModelSerializer
):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:

        model = ESGRecord

        fields = [

            "id",

            "company_name",

            "scope",

            "category",

            "activity_type",

            "quantity",

            "unit",

            "normalized_quantity",

            "normalized_unit",

            "co2e_emissions",

            "review_status",

            "is_flagged",

            "flag_reason",

            "occurred_on",

            "created_at",
        ]