from django.contrib.auth.models import User

from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:

        model = User

        fields = [
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user
    


from apps.accounts.models import User


class MeSerializer(
    serializers.ModelSerializer
):

    company = serializers.SerializerMethodField()

    class Meta:

        model = User

        fields = [

            "id",

            "username",

            "email",

            "role",

            "company",
        ]


    def get_company(
        self,
        obj
    ):

        if not obj.company:

            return None

        return {

            "id": str(
                obj.company.id
            ),

            "name":
                obj.company.name,

            "slug":
                obj.company.slug,

            "industry":
                obj.company.industry,

            "country":
                obj.company.country,
        }








