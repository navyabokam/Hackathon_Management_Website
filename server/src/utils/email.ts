import nodemailer from 'nodemailer';
import { config } from '../config/index';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: config.smtp.user
    ? {
        user: config.smtp.user,
        pass: config.smtp.pass,
      }
    : undefined,
});

export async function sendConfirmationEmail(
  to: string,
  teamName: string,
  registrationId: string,
  teamMembers: string[]
): Promise<void> {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { color: #333; margin-bottom: 20px; }
          .highlight { background: #e7f3ff; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }
          .id { font-size: 24px; font-weight: bold; color: #2196F3; }
          .footer { color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>Registration Confirmed! 🎉</h1>
              <p>Thank you for registering for the College Hackathon.</p>
            </div>

            <div class="highlight">
              <p><strong>Your Registration ID:</strong></p>
              <p class="id">${registrationId}</p>
            </div>

            <h2>Team Details</h2>
            <p><strong>Team Name:</strong> ${teamName}</p>
            <p><strong>Team Members (${teamMembers.length}):</strong></p>
            <ul>
              ${teamMembers.map((member) => `<li>${member}</li>`).join('')}
            </ul>

            <p style="margin-top: 20px; color: #666;">
              Please keep your Registration ID safe. You'll need it to verify your team on the day of the hackathon.
            </p>

            <div class="footer">
              <p>For any queries, contact the organizers.</p>
              <p>&copy; 2024 College Hackathon. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: 'noreply@hackathon.local',
    to,
    subject: `Hackathon Registration Confirmed - ID: ${registrationId}`,
    html: htmlContent,
  };

  try {
    if (config.nodeEnv === 'production') {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('[EMAIL MOCK]', JSON.stringify(mailOptions, null, 2));
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
