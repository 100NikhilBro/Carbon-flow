import csv

from apps.auditlogs.models import AuditLog

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from django.http import HttpResponse
from openpyxl import Workbook

from django.utils import timezone
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated

from apps.esg.models import ESGRecord
from apps.esg.serializers import ESGRecordSerializer

from apps.common.permissions import IsAnalystOrAdmin


class ApproveESGRecordAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAnalystOrAdmin,
    ]

    def post(self, request, record_id):

        record = ESGRecord.objects.get(
            id=record_id,
            company=request.user.company
        )

        record.review_status = "approved"

        record.reviewed_by = request.user.username

        record.reviewed_at = timezone.now()

        record.save()

        AuditLog.objects.create(

            username=request.user.username,

            action="approved",

            entity_type="ESGRecord",

            entity_id=str(record.id),

            changes={
                "review_status": {
                    "old": "pending",
                    "new": "approved",
                }
            }
        )

        channel_layer = get_channel_layer()

        group_name = (
    f"company_{record.company.id}"
)
        

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_esg_update",
                "data": {
                    "event": "record_approved",
                    "record_id": str(record.id),
                    "status": record.review_status,
                },
            },
        )

        return Response(
            {
                "message": "Record approved"
            },
            status=status.HTTP_200_OK
        )


class RejectESGRecordAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAnalystOrAdmin,
    ]

    def post(self, request, record_id):

        record = ESGRecord.objects.get(
            id=record_id,
            company=request.user.company
        )

        analyst_notes = request.data.get(
            "analyst_notes"
        )

        record.review_status = "rejected"

        record.reviewed_by = request.user.username

        record.reviewed_at = timezone.now()

        record.analyst_notes = analyst_notes

        record.save()

        AuditLog.objects.create(

            username=request.user.username,

            action="rejected",

            entity_type="ESGRecord",

            entity_id=str(record.id),

            changes={
                "review_status": {
                    "old": "pending",
                    "new": "rejected",
                }
            }
        )

        channel_layer = get_channel_layer()

        group_name = (
    f"company_{record.company.id}"
)

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_esg_update",
                "data": {
                    "event": "record_rejected",
                    "record_id": str(record.id),
                    "status": record.review_status,
                },
            },
        )

        return Response(
            {
                "message": "Record rejected"
            },
            status=status.HTTP_200_OK
        )


class ESGRecordListAPIView(ListAPIView):

    serializer_class = ESGRecordSerializer

    filter_backends = [OrderingFilter]

    ordering_fields = [
        "co2e_emissions",
        "occurred_on",
        "created_at",
        "quantity",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):

        queryset = ESGRecord.objects.filter(
            company=self.request.user.company
        ).order_by("-created_at")

        review_status = self.request.GET.get(
            "review_status"
        )

        scope = self.request.GET.get(
            "scope"
        )

        is_flagged = self.request.GET.get(
            "is_flagged"
        )

        search = self.request.GET.get(
            "search"
        )

        if review_status:

            queryset = queryset.filter(
                review_status=review_status
            )

        if scope:

            queryset = queryset.filter(
                scope=scope
            )

        if is_flagged:

            if is_flagged.lower() == "true":

                queryset = queryset.filter(
                    is_flagged=True
                )

        if search:

            queryset = queryset.filter(
                Q(activity_type__icontains=search)
                |
                Q(company__name__icontains=search)
            )

        return queryset


class ExportESGCSVAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        response = HttpResponse(
            content_type="text/csv"
        )

        response["Content-Disposition"] = (
            'attachment; filename="esg_records.csv"'
        )

        writer = csv.writer(response)

        writer.writerow([
            "Company",
            "Scope",
            "Activity Type",
            "Quantity",
            "Unit",
            "CO2e Emissions",
            "Review Status",
            "Flagged",
        ])

        records = ESGRecord.objects.filter(
            company=request.user.company
        )

        for record in records:

            writer.writerow([
                record.company.name,
                record.scope,
                record.activity_type,
                record.quantity,
                record.unit,
                record.co2e_emissions,
                record.review_status,
                record.is_flagged,
            ])

        return response


class ExportESGExcelAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        workbook = Workbook()

        worksheet = workbook.active

        worksheet.title = "ESG Records"

        headers = [
            "Company",
            "Scope",
            "Activity Type",
            "Quantity",
            "Unit",
            "CO2e Emissions",
            "Review Status",
            "Flagged",
        ]

        worksheet.append(headers)

        records = ESGRecord.objects.filter(
            company=request.user.company
        )

        for record in records:

            worksheet.append([
                record.company.name,
                record.scope,
                record.activity_type,
                record.quantity,
                record.unit,
                record.co2e_emissions,
                record.review_status,
                record.is_flagged,
            ])

        response = HttpResponse(
            content_type=(
                "application/vnd.openxmlformats-"
                "officedocument.spreadsheetml.sheet"
            )
        )

        response["Content-Disposition"] = (
            'attachment; filename="esg_records.xlsx"'
        )

        workbook.save(response)

        return response