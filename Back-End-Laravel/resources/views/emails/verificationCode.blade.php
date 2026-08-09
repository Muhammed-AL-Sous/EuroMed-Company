<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="UTF-8">
    <title>Verification Code</title>
</head>

<body>
    <div class="container" style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello {{ $user->name }} !</h2>
        <p>Thank you for registering.
            Please use the verification code below to activate your account:</p>
        <h1
            style="background-color: #f0f0f0; padding: 10px; display: block; margin:auto; text-align: center; border-radius: 5px;">
            {{ $code }}</h1>
        <p style="margin-top: 5px;">
            This code is valid for 10 minutes only.
        </p>
        <p>Thank you,<br>{{ config('app.name') }}</p>
    </div>
</body>

</html>
