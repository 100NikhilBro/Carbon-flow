from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from rest_framework.permissions import IsAuthenticated

from apps.accounts.serializers import MeSerializer

from apps.accounts.serializers import RegisterSerializer


class RegisterAPIView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "User registered successfully"
            },
            status=status.HTTP_201_CREATED
        )
    

class MeAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        serializer = MeSerializer(
            request.user
        )

        return Response(
            serializer.data
        )