from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import EmailValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.crypto import get_random_string
from .tasks import send_email_task
from .models import Customer
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'لطفاً رمز عبور خود را وارد کنید.'
    })
    confirm_password = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'لطفاً تأیید رمز عبور خود را وارد کنید.'
    })
    
    class Meta:
        model = Customer
        fields = ['id', 'username', 'email', 'password', 'confirm_password']
        
        extra_kwargs = {
            'username': {
                'validators': [
                    UniqueValidator(queryset=Customer.objects.all(),
                    message="قبلا حسابی با این نام کاربری ثبت شده است"),
                ],
                'error_messages': {
                    'max_length': 'نام کاربری نمی‌تواند بیشتر از 150 کاراکتر باشد.',
                    'required': 'لطفاً نام کاربری خود را وارد کنید.',
                }
            },
            'email': {
                'validators': [
                    UniqueValidator(queryset=Customer.objects.all(), message="قبلا حسابی با این ایمیل ثبت شده است."),
                    EmailValidator(message="فرمت ایمیل وارد شده معتبر نیست. لطفاً یک ایمیل معتبر وارد کنید.")
                ],
                'error_messages': {
                    'required': 'لطفاً ایمیل خود را وارد کنید.',
                }
            }
        }
        
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "تکرار گذرواژه مغایرت دارد"})
        
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({'password': 'لطفا رمز عبور بالای ۸ کاراکتر و ایمن انتخاب کنید.'})

        return attrs
    
    def create(self, validated_data):
        user = Customer.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            auth_code=get_random_string(72),
            is_active = False

        )
        user.set_password(validated_data['password'])
        
        #send confirm email
        # email_context = {
        #     'user' : user,
        # }
        
        # send_email_task.delay(
        #     subject='فعالسازی حساب کاربری',
        #     to=validated_data['email'],
        #     context=email_context,
        #     template_name='email/activate_account.html',
        # )
            
        user.save()

        return user

class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            "required": "لطفاً ایمیل خود را وارد کنید.",
            "invalid": "فرمت ایمیل وارد شده معتبر نیست. لطفاً یک ایمیل معتبر وارد کنید.",
        }
    )

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'لطفاً رمز عبور خود را وارد کنید.'
    })
    confirm_password = serializers.CharField(write_only=True, required=True, error_messages={
        'required': 'لطفاً تأیید رمز عبور خود را وارد کنید.'
    })

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "تکرار گذرواژه مغایرت دارد"})
        
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({'password': 'لطفا رمز عبور بالای ۸ کاراکتر و ایمن انتخاب کنید.'})

        return attrs