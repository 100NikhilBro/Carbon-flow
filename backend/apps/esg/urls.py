from django.urls import path

from apps.esg.views import (
    ApproveESGRecordAPIView,
    RejectESGRecordAPIView,
    ESGRecordListAPIView,
    ExportESGCSVAPIView,
    ExportESGExcelAPIView,
)

urlpatterns = [

    path(
        "records/",
        ESGRecordListAPIView.as_view(),
        name="esg-records",
    ),

    path(
        "<uuid:record_id>/approve/",
        ApproveESGRecordAPIView.as_view(),
        name="approve-esg-record",
    ),

    path(
        "<uuid:record_id>/reject/",
        RejectESGRecordAPIView.as_view(),
        name="reject-esg-record",
    ),

    path(
    "export/csv/",
    ExportESGCSVAPIView.as_view(),
    name="export-esg-csv",
),

    path(
    "export/excel/",
    ExportESGExcelAPIView.as_view(),
    name="export-esg-excel",
),
]