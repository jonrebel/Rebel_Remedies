from rest_framework.routers import DefaultRouter
from .views import TicketViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketCommentViewSet


router = DefaultRouter()
router.register(r"tickets", TicketViewSet, basename="ticket")

urlpatterns = [
    path("", include(router.urls)),
    path("tickets/<int:ticket_id>/comments/", TicketCommentViewSet.as_view({
        "get": "list",
        "post": "create",
    })),
]
