import cloudinary
import cloudinary.uploader

from decouple import config

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.common.permissions import IsAnalystOrAdmin

from apps.auditlogs.models import AuditLog

from apps.uploads.models import UploadJob
from apps.uploads.serializers import UploadFileSerializer
from apps.uploads.tasks import process_upload_job


cloudinary.config(
    cloud_name=config("CLOUDINARY_CLOUD_NAME"),
    api_key=config("CLOUDINARY_API_KEY"),
    api_secret=config("CLOUDINARY_API_SECRET"),
    secure=True,
)


class UploadFileAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAnalystOrAdmin,
    ]

    def post(self, request):

        serializer = UploadFileSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # =========================
        # MULTI-TENANT SAFE COMPANY
        # =========================

        company = request.user.company

        uploaded_file = serializer.validated_data[
            "file"
        ]

        # =========================
        # UPLOAD TO CLOUDINARY
        # =========================

        cloudinary_response = (
            cloudinary.uploader.upload(
                uploaded_file,
                resource_type="raw",
                folder="carbonflow_uploads",
            )
        )

        # =========================
        # CREATE UPLOAD JOB
        # =========================

        upload_job = UploadJob.objects.create(

            company=company,

            source_type=serializer.validated_data[
                "source_type"
            ],

            original_file_name=uploaded_file.name,

            file=cloudinary_response[
                "secure_url"
            ],

            uploaded_by=request.user.username,

            status="pending",
        )

        # =========================
        # AUDIT LOG
        # =========================

        AuditLog.objects.create(

            username=request.user.username,

            action="uploaded",

            entity_type="UploadJob",

            entity_id=str(upload_job.id),

            changes={

                "file_name":
                    uploaded_file.name,

                "source_type":
                    serializer.validated_data[
                        "source_type"
                    ],
            }
        )

        # =========================
        # START CELERY TASK
        # =========================

        process_upload_job.delay(
            str(upload_job.id)
        )

        return Response(
            {
                "message": "Upload started",

                "upload_job_id": str(
                    upload_job.id
                ),

                "file_url": upload_job.file,
            },

            status=status.HTTP_201_CREATED
        )