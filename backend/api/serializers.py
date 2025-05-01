from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role
        token['full_name'] = user.full_name
        token['email'] = user.email

        return token
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'role')
        read_only_fields = ['email', 'role']



class AvailabilitySerializer(serializers.ModelSerializer):
    doctor = serializers.SlugRelatedField(slug_field='email', queryset=User.objects.all())

    class Meta:
        model = Availability
        fields = ['id', 'doctor', 'date', 'start_time', 'end_time']

class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.SlugRelatedField(slug_field='email', queryset=User.objects.all())
    doctor = serializers.SlugRelatedField(slug_field='email', queryset=User.objects.all())
    scheduled_time = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=Appointment.STATUS_CHOICES)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'scheduled_time', 'visit_type' , 'reason', 'status', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Ensure that appointment time is during the doctor's availability
        doctor = attrs.get('doctor')
        scheduled_time = attrs.get('scheduled_time')

        # Check for doctor availability
        availability = Availability.objects.filter(
            doctor=doctor,
            date=scheduled_time.date(),
            start_time__lte=scheduled_time.time(),
            end_time__gte=scheduled_time.time()
        ).exists()

        if not availability:
            raise serializers.ValidationError("The doctor is not available at the requested time.")

        return attrs


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'medication_name', 'dosage', 'is_active']

class MedicalRecordSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, required=False)

    class Meta:
        model = MedicalRecord
        fields = [
            'id',
            'diagnosis',
            'symptoms',
            'notes',
            'date',
            'prescriptions',
            'patient',
            'doctor',
        ]
        read_only_fields = ['date', 'patient', 'doctor']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user

        prescriptions_data = validated_data.pop('prescriptions', [])

        # Assume doctor is creating the record
        if hasattr(user, 'doctor'):
            validated_data['doctor'] = user.doctor
        # If patient is allowed to create, assign them
        if hasattr(user, 'patient'):
            validated_data['patient'] = user.patient

        medical_record = MedicalRecord.objects.create(**validated_data)
        for prescription in prescriptions_data:
            Prescription.objects.create(medical_record=medical_record, **prescription)
        return medical_record

    def update(self, instance, validated_data):
        prescriptions_data = validated_data.pop('prescriptions', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if prescriptions_data:
            instance.prescriptions.all().delete()
            for prescription in prescriptions_data:
                Prescription.objects.create(medical_record=instance, **prescription)
        return instance

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialty', 'bio', 'availability']
        depth = 1