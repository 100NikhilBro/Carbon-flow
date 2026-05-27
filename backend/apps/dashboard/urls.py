from django.urls import path

from apps.dashboard.views import (
    DashboardSummaryAPIView,
    EmissionsByScopeAPIView,
    ReviewStatusAPIView,
    FlaggedRecordsAPIView,
)


urlpatterns = [

    path(
        "summary/",
        DashboardSummaryAPIView.as_view(),
        name="dashboard-summary",
    ),

    path(
        "emissions-by-scope/",
        EmissionsByScopeAPIView.as_view(),
        name="emissions-by-scope",
    ),

    path(
    "review-status/",
    ReviewStatusAPIView.as_view(),
    name="review-status",
),


   path(
    "flagged-records/",
    FlaggedRecordsAPIView.as_view(),
    name="flagged-records",
),

]