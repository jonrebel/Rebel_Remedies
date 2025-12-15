from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ticket, TicketComment
from .serializers import TicketSerializer, TicketCommentSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "priority"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "priority", "status"]
    
    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.all().order_by("-created_at")

        if user.is_staff:
            return qs
        return qs.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class TicketCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TicketCommentSerializer

    def get_queryset(self):
        ticket_id = self.kwargs["ticket_id"]
        return TicketComment.objects.filter(ticket_id=ticket_id).order_by("created_at")

    def perform_create(self, serializer):
        ticket_id = self.kwargs["ticket_id"]
        serializer.save(ticket_id=ticket_id)

