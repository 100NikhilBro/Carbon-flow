from django.db.models import Sum, Count
from django.db.models.functions import Coalesce

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.esg.models import ESGRecord


class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_records = ESGRecord.objects.count()

        approved_records = ESGRecord.objects.filter(
            review_status="approved"
        ).count()

        pending_records = ESGRecord.objects.filter(
            review_status="pending"
        ).count()

        rejected_records = ESGRecord.objects.filter(
            review_status="rejected"
        ).count()

        flagged_records = ESGRecord.objects.filter(
            is_flagged=True
        ).count()

        total_emissions = ESGRecord.objects.aggregate(
            total=Sum("co2e_emissions")
        )["total"] or 0

        return Response({
            "total_records": total_records,
            "approved_records": approved_records,
            "pending_records": pending_records,
            "rejected_records": rejected_records,
            "flagged_records": flagged_records,
            "total_emissions": total_emissions,
        })


class EmissionsByScopeAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        data = (
            ESGRecord.objects
            .values("scope")
            .annotate(
                total_emissions=Coalesce(
                    Sum("co2e_emissions"),
                    0.0
                )
            )
            .order_by("scope")
        )

        return Response(data)


class ReviewStatusAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        data = (
            ESGRecord.objects
            .values("review_status")
            .annotate(count=Count("id"))
            .order_by("review_status")
        )

        return Response(data)


class FlaggedRecordsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        data = (
            ESGRecord.objects
            .filter(is_flagged=True)
            .values(
                "id",
                "company__name",
                "activity_type",
                "quantity",
                "unit",
                "flag_reason",
                "review_status",
            )
            .order_by("-created_at")
        )

        return Response(data)