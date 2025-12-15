from django.contrib import admin
from .models import Ticket
from .models import TicketComment


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'created_at')
    list_filter = ('status', 'priority', 'created_at')
    search_fields = ('title', 'description')

admin.site.register(TicketComment)
