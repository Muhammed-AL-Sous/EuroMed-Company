<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContactMessageMail extends Mailable
{
    public function __construct(
        public array $contact
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'EuroMed Contact: ' . $this->contact['subject'],
            replyTo: [
                new Address(
                    $this->contact['email'],
                    $this->contact['name']
                ),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-message',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
