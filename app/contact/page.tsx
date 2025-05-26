'use client';

import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import Footer from 'components/layout/footer'

export default function ContactUs() {
  const contacts = [
    {
      label: 'Email',
      value: 'crlapples19@gmail.com',
      icon: <Mail className="h-5 w-5 text-primary" />,
      href: 'mailto:crlapples19@gmail.com',
    },
    {
      label: 'Phone',
      value: '+1 (385) 227-1642',
      icon: <Phone className="h-5 w-5 text-primary" />,
      href: 'tel:+13852271642',
    },
    {
      label: 'Location',
      value: 'Las Vegas, NV, USA',
      icon: <MapPin className="h-5 w-5 text-primary" />,
    },
    {
      label: 'Website',
      value: 'https://ingameshop.vercel.app',
      icon: <Globe className="h-5 w-5 text-primary" />,
      href: 'https://ingameshop.vercel.app',
    },
  ];

  return (
    <>
    <div className="max-w-3xl min-h-[70%] mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-center text-muted-foreground mb-10">
        We'd love to hear from you. Feel free to reach out using the information below.
      </p>
      <div className="space-y-6">
        {contacts.map(({ label, value, icon, href }) => (
          <div key={label} className="flex items-start space-x-4">
            <div>{icon}</div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              {href ? (
                <a
                  href={href}
                  className="text-lg font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value}
                </a>
              ) : (
                <p className="text-lg font-semibold">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
