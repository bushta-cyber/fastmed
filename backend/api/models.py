from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.conf import settings
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', "Admin")
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'role']

    objects = UserManager()

    def __str__(self):
        return self.email

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments_doctor', limit_choices_to={'role': 'doctor'})
    scheduled_time = models.DateTimeField()
    reason = models.TextField()
    visit_type = models.CharField(max_length=20, default='in-person')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_time']
        unique_together = ('doctor', 'scheduled_time')

    def __str__(self):
        return f"{self.patient} with {self.doctor} at {self.scheduled_time}"

class Availability(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_availability', limit_choices_to={'role': 'doctor'})
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ('doctor', 'date', 'start_time')

    def __str__(self):
        return f"{self.doctor} available {self.date} from {self.start_time} to {self.end_time}"


class MedicalRecord(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_records', limit_choices_to={'role': 'patient'})
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='records', limit_choices_to={'role': 'doctor'})
    diagnosis = models.CharField(max_length=255)
    symptoms = models.JSONField()  # Stores list like ["Fever", "Cough"]
    notes = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.full_name} - {self.diagnosis}"

class Prescription(models.Model):
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name="prescriptions")
    medication_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.medication_name} - {self.dosage}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    availability = models.JSONField(default=dict)
