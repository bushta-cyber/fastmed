from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from .views import *
from .serializers import CustomTokenObtainPairSerializer
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'availability', AvailabilityViewSet)
router.register(r'medical-records', MedicalRecordViewSet)
router.register(r'prescriptions', PrescriptionViewSet)

urlpatterns = [
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/me/', UserProfileView.as_view(), name='user_profile'),
    path('api/doctors/search/', DoctorSearchView.as_view(), name='doctor-search'),
    path('api/', include(router.urls)),

    # appointments

]
