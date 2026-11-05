<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>EuroMed Contact Inquiry</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #334155;">

    <div style="max-width: 620px; margin: auto; background: white; padding: 28px; border-radius: 14px;">

        <h2 style="color: #0369a1;">
            New Contact Inquiry - EuroMed
        </h2>

        <p><strong>Name:</strong> {{ $contact['name'] }}</p>

        <p><strong>Phone:</strong> {{ $contact['phone'] }}</p>

        <p><strong>Email:</strong> {{ $contact['email'] }}</p>

        <p><strong>Subject:</strong> {{ $contact['subject'] }}</p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0;">

        <h3>Message:</h3>

        <div style="white-space: pre-wrap; line-height: 1.8;">{{ $contact['message'] }}</div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0;">

        <p style="font-size: 12px; color: #64748b;">
            This message was submitted through the EuroMed website contact form.
        </p>

    </div>
</body>

</html>
