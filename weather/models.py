from django.db import models

# Create your models here.
class city_code(models.Model):
    name = models.CharField(max_length=32)
    code = models.CharField(max_length=32)
    
