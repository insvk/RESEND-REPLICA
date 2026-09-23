export interface SendEmailOptions {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface SendEmailResult {
  providerId: string;
  error?: string;
}

export interface EmailProvider {
  /**
   * Dispatches the email to the underlying provider (SMTP, AWS SES, etc).
   * Returns a provider-specific ID on success.
   */
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
  
  /**
   * Verifies domain DNS records required by the provider.
   */
  verifyDomain?(domain: string): Promise<boolean>;
}
