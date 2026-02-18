from django.urls import path
from .views import plan_trip
from .views import export_pdf

urlpatterns = [
    path("plan-trip/", plan_trip),
    path("export-pdf/",export_pdf),
]
