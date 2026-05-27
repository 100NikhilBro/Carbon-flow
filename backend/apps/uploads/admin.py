from django.contrib import admin

from .models import UploadJob


@admin.register(UploadJob)
class UploadJobAdmin(admin.ModelAdmin):

    list_display = (
        "company",
        "source_type",
        "status",
        "uploaded_by",
        "uploaded_at",
    )

    list_filter = (
        "source_type",
        "status",
    )

    search_fields = (
        "original_file_name",
        "uploaded_by",
    )