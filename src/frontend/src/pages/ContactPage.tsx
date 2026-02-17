import { Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  const ownerEmail = 'brianlellis24@gmail.com';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Get in Touch</CardTitle>
            <CardDescription className="text-base">
              Have questions or feedback? We'd love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Email Address</h3>
                <p className="text-lg font-mono text-foreground">{ownerEmail}</p>
              </div>
              <div>
                <a
                  href={`mailto:${ownerEmail}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
              </div>
            </div>
            <div className="pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                Click the button above to open your email client, or copy the email address to reach out directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
