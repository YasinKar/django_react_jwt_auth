from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from django.utils.crypto import get_random_string
from .models import Customer
from .serializers import RegisterSerializer, EmailSerializer, ResetPasswordSerializer
from .tasks import send_email_task

class RegisterView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class ActivateAccountView(APIView):
    def get(self, request, auth_code):
        user = Customer.objects.filter(auth_code__iexact=auth_code).first()
        if user is not None:
            if not user.is_active:
                user.is_active = True
                user.auth_code = get_random_string(72)
                user.save()
                
                return Response({'message': 'حساب کاربری شما فعال شد.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'حساب کاربری شما در حال حاضر فعال است.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            raise Http404("کد اهراز هویت نامعتبر.")
        
class ForgotPasswordAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = Customer.objects.filter(email__iexact=email).first()
            if user is not None:
                # email_context ={
                #     'user' : user,
                # }
                
                # send_email_task.delay(
                #     subject='بازیابی رمز عبور',
                #     to= user.email,
                #     context=email_context,
                #     template_name='email/reset_pass.html'
                # )
                
                return Response({'message': 'ایمیلی حاوی لینک بازیابی گذرواژه برای شما فرستاده شد.', 'email': email}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'حسابی با این ایمیل یافت نشد.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordAPIView(APIView):
    def post(self, request, auth_code):
        user = Customer.objects.filter(auth_code=auth_code).first()
        
        if user is not None:
            reset_pass_form = ResetPasswordSerializer(data=request.data)
            if reset_pass_form.is_valid():
                user_new_pass = reset_pass_form.validated_data.get('password')
                user.set_password(user_new_pass)
                user.auth_code = get_random_string(72)
                user.is_active = True
                user.save()
            
                return Response({"message": "گذرواژه جدید شما با موفقیت ثبت شد."}, status=status.HTTP_200_OK)
            
            return Response(reset_pass_form.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "کد اهراز هویت نامعتبر."}, status=status.HTTP_404_NOT_FOUND)