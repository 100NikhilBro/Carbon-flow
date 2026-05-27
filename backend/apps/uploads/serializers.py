from rest_framework import serializers


class UploadFileSerializer(
    serializers.Serializer
):

    source_type = serializers.ChoiceField(
        choices=[
            "sap",
            "utility",
            "travel",
        ]
    )

    file = serializers.FileField()