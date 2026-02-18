from django.db import models

class Trip(models.Model):

    start_lat = models.FloatField()
    start_lng = models.FloatField()
    end_lat = models.FloatField()
    end_lng = models.FloatField()

    total_miles = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id} - {self.total_miles} miles"
