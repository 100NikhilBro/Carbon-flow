from rest_framework import serializers


class UploadFileSerializer(serializers.Serializer):

    company_id = serializers.UUIDField()

    source_type = serializers.ChoiceField(
        choices=[
            "sap",
            "utility",
            "travel",
        ]
    )

    file = serializers.FileField()