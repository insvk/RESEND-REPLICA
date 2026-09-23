import { EmailProvider, SendEmailOptions, SendEmailResult } from './emailProvider';

/**
 * A simple Mock Provider that just logs emails instead of sending them.
 * Useful for local development without SMTP credentials.
 */
export class MockLogProvider implements EmailProvider {
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    console.log('[MockLogProvider] Sending email:', {
      to: options.to,
      subject: options.subject,
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a fake provider ID
    const providerId = `mock_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`[MockLogProvider] Email sent. Provider ID: ${providerId}`);
    
    return { providerId };
  }
}

// Factory to get the configured provider
export async function getEmailProvider(): Promise<EmailProvider> {
  if (process.env.SMTP_HOST) {
    const { SmtpProvider } = await import('./smtpProvider');
    return new SmtpProvider();
  }
  
  return new MockLogProvider();
}
