from rest_framework import generics, permissions, viewsets, filters
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsDoctorUser
import datetime
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AvailabilityViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing doctor availability.
    """
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Ensure the doctor is authenticated and creating their own availability
        doctor = self.request.user
        if doctor.role != 'Doctor':
            raise serializers.ValidationError("You must be a doctor to create availability.")
        serializer.save(doctor=doctor)

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing appointments.
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        patient = self.request.user
        if patient.role != 'Patient':
            raise serializers.ValidationError("You must be a patient to book an appointment.")
        serializer.save(patient=patient)

    def update(self, request, *args, **kwargs):
        """
        Override update method to prevent modification of appointment status
        by anyone other than the admin or doctor.
        """
        appointment = self.get_object()
        if appointment.status != Appointment.PENDING:
            return Response({"detail": "This appointment cannot be modified."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        status = self.request.query_params.get('status')
        filter_type = self.request.query_params.get('filter')
        user = self.request.user


        if user.role == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        return Appointment.objects.none()

    # def list(self, request, *args, **kwargs):
    #     """
    #     Override list method to show appointments for the current logged-in user.
    #     Patients should see their own appointments, doctors should see their appointments.
    #     """
    #     user = self.request.user
    #     if request.user.role == 'Patient':
    #         self.queryset = self.queryset.filter(patient=user)
    #     elif request.user.role == 'Doctor':
    #         self.queryset = self.queryset.filter(doctor=user)
    #     return super().list(request, *args, **kwargs)

    # def get_queryset(self):
    #     queryset = super().get_queryset()
    #     user_id = self.request.query_params.get('user')
    #     status = self.request.query_params.get('status')
    #     filter_type = self.request.query_params.get('filter')

    #     if user_id:
    #         queryset = queryset.filter(patient_id=user_id)

    #     if status:
    #         queryset = queryset.filter(status=status)

    #     if filter_type == "upcoming":
    #         queryset = queryset.filter(date__gte=datetime.now())  # Filter for upcoming appointments
    #     elif filter_type == "past":
    #         queryset = queryset.filter(date__lt=datetime.now())  # Filter for past appointments

    #     return queryset


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        status = self.request.query_params.get('status')
        filter_type = self.request.query_params.get('filter')
        user = self.request.user

        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient=user)
        elif user.role == 'doctor':
            return MedicalRecord.objects.filter(doctor=user)
        return MedicalRecord.objects.none()

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorSearchView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorProfileSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['user__first_name', 'user__last_name', 'specialty']
    filterset_fields = ['specialty']