import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import type { ITeam } from '../models/index.js';

// Create transporter for Gmail SMTP with timeout configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user || 'forgeascend@gmail.com',
    pass: config.email.pass || '',
  },
  // Add connection timeouts to prevent hanging on Render
  connectionTimeout: 10000, // 10 seconds to establish connection
  socketTimeout: 10000,     // 10 seconds for socket operations
  greetingTimeout: 10000,   // 10 seconds for SMTP greeting
});

// Verify SMTP connection on module load (non-blocking)
function verifyEmailConfig(): void {
  console.log('📧 EMAIL SERVICE: Starting verification in background...');
  if (!config.email.user || !config.email.pass) {
    console.error('  ✗ CRITICAL: Email user or password not configured!');
    console.error('  Email will NOT be sent. Set EMAIL_USER and EMAIL_PASS environment variables.');
    return;
  }
  
  // Verify asynchronously without blocking server startup
  transporter.verify()
    .then(() => {
      console.log('✅ Email service connected successfully');
      console.log(`📧 Email user: ${config.email.user}`);
    })
    .catch((error) => {
      console.error('❌ CRITICAL: Email service failed to verify!');
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && 'code' in error) {
        const code = (error as any).code;
        if (code === 'ETIMEDOUT') {
          console.error('⚠️  TIMEOUT: Cannot reach smtp.gmail.com from Render');
          console.error('💡 Solution: Try switching to SendGrid (see EMAIL_SENDGRID_SETUP.md)');
        } else if (code === 'EAUTH') {
          console.error('⚠️  AUTH ERROR: Gmail authentication failed');
          console.error('💡 Solution: Verify EMAIL_PASS is a valid Gmail App Password');
        }
      }
    });
}

// Verify on startup (non-blocking)
verifyEmailConfig();

// Helper function to send emails with retry logic
async function sendEmailWithRetry(mailOptions: any, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${maxRetries}: ${mailOptions.to}`);
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      lastError = error as Error;
      const code = (error as any)?.code;
      const message = error instanceof Error ? error.message : String(error);
      
      console.error(`  ❌ Attempt ${attempt} failed: ${message}`);
      
      // Don't retry on auth errors
      if (code === 'EAUTH') {
        throw error;
      }
      
      // Wait before retrying (100ms, 500ms, etc)
      if (attempt < maxRetries) {
        const waitTime = 100 * Math.pow(2, attempt - 1);
        console.log(`  ⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
}

export async function sendRegistrationConfirmationEmail(team: ITeam): Promise<void> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .registration-id {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .registration-id p {
            font-size: 12px;
            opacity: 0.9;
            margin-bottom: 10px;
          }
          .registration-id .id-value {
            font-size: 32px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
          }
          .section {
            margin: 30px 0;
          }
          .section h2 {
            font-size: 16px;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #666;
            font-weight: 500;
          }
          .detail-value {
            color: #333;
            font-weight: 600;
          }
          .team-members {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
          }
          .team-member-item {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .team-member-item:last-child {
            border-bottom: none;
          }
          .team-member-name {
            font-weight: 600;
            color: #333;
          }
          .team-member-email {
            color: #666;
            font-size: 13px;
          }
          .team-member-badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
          }
          .important-note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
            color: #856404;
          }
          .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
          .footer-text {
            margin: 5px 0;
          }
          .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 20px;
            font-weight: 600;
          }
          .cta-button:hover {
            background: #764ba2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🎉 Registration Confirmed!</h1>
            <p>ForgeAscend v1.0 – 24-Hour Mega Build-a-thon</p>
          </div>

          <!-- Main Content -->
          <div class="content">
            <!-- Registration ID -->
            <div class="registration-id">
              <p>YOUR REGISTRATION ID</p>
              <div class="id-value">${team.registrationId}</div>
            </div>

            <!-- Team Information -->
            <div class="section">
              <h2>Team Information</h2>
              <div class="detail-row">
                <span class="detail-label">Team Name:</span>
                <span class="detail-value">${team.teamName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">College/University:</span>
                <span class="detail-value">${team.collegeName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Team Size:</span>
                <span class="detail-value">${team.teamSize} Member${team.teamSize !== '1' ? 's' : ''}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #28a745;">✓ ${team.status}</span>
              </div>
            </div>

            <!-- Team Leader -->
            <div class="section">
              <h2>Team Leader</h2>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${team.participant1Name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${team.participant1Email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${team.leaderPhone}</span>
              </div>
            </div>

            <!-- Team Members -->
            ${(team.participant2Name && team.participant2Name.trim()) || 
              (team.participant3Name && team.participant3Name.trim()) ||
              (team.participant4Name && team.participant4Name.trim())
              ? `
              <div class="section">
                <h2>Team Members</h2>
                <div class="team-members">
                  <div class="team-member-item">
                    <span class="team-member-name">${team.participant1Name}</span>
                    <span class="team-member-badge">LEADER</span>
                    <div class="team-member-email">${team.participant1Email}</div>
                  </div>
                  ${team.participant2Name && team.participant2Name.trim() ? `
                  <div class="team-member-item">
                    <span class="team-member-name">${team.participant2Name}</span>
                    <div class="team-member-email">${team.participant2Email}</div>
                  </div>
                  ` : ''}
                  ${team.participant3Name && team.participant3Name.trim() ? `
                  <div class="team-member-item">
                    <span class="team-member-name">${team.participant3Name}</span>
                    <div class="team-member-email">${team.participant3Email}</div>
                  </div>
                  ` : ''}
                  ${team.participant4Name && team.participant4Name.trim() ? `
                  <div class="team-member-item">
                    <span class="team-member-name">${team.participant4Name}</span>
                    <div class="team-member-email">${team.participant4Email}</div>
                  </div>
                  ` : ''}
                </div>
              </div>
              `
              : ''}

            <!-- Payment -->
            <div class="section">
              <h2>Payment Details</h2>
              <div class="detail-row">
                <span class="detail-label">UTR/Reference ID:</span>
                <span class="detail-value">${team.utrId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value" style="color: #28a745;">✓ Success</span>
              </div>
            </div>

            <!-- Important Note -->
            <div class="important-note">
              <strong>📌 Important Note:</strong> Please save this registration ID and bring a valid ID proof on the day of the hackathon. 
              All team members must arrive on time for verification.
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-text">
              <strong>Team ForgeAscend v1.0</strong>
            </div>
            <div class="footer-text">
              Department of Computer Science & Engineering
            </div>
            <div class="footer-text">
              KLH University, Bachupally Campus
            </div>
            <div class="footer-text" style="margin-top: 15px; opacity: 0.7;">
              © 2026 ForgeAscend v1.0. All rights reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: config.email.user || 'forgeascend@gmail.com',
    to: team.participant1Email,
    subject: `Registration Confirmed – ForgeAscend v1.0 Build-a-thon (${team.registrationId})`,
    html: htmlContent,
  };

  try {
    const info = await sendEmailWithRetry(mailOptions);
    console.log(`✅ Confirmation email sent to ${team.participant1Email}`);
    console.log(`📬 Email response ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ CRITICAL: Failed to send confirmation email');
    console.error('Recipient:', team.participant1Email);
    console.error('Error type:', error instanceof Error ? error.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && 'code' in error) {
      const code = (error as any).code;
      console.error('Error code:', code);
      if (code === 'ETIMEDOUT') {
        console.error('⚠️  RENDER TIMEOUT: Gmail SMTP unreachable');
        console.error('💡 Solution: Switch to SendGrid or another email service');
      }
    }
    // Don't throw - email failure should not block registration
  }
}

export async function sendConfirmationEmail(
  to: string,
  teamName: string,
  registrationId: string,
  teamMembers: string[]
): Promise<void> {
  // Backward compatibility wrapper
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
    from: config.email.user || 'forgeascend@gmail.com',
    to,
    subject: `Hackathon Registration Confirmed - ID: ${registrationId}`,
    html: htmlContent,
  };

  try {
    const info = await sendEmailWithRetry(mailOptions);
    console.log(`✅ Confirmation email sent to ${to}`);
    console.log(`📬 Email response ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ CRITICAL: Failed to send confirmation email');
    console.error('Recipient:', to);
    console.error('Error type:', error instanceof Error ? error.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && 'code' in error) {
      const code = (error as any).code;
      console.error('Error code:', code);
      if (code === 'ETIMEDOUT') {
        console.error('⚠️  RENDER TIMEOUT: Gmail SMTP unreachable');
        console.error('💡 Solution: Switch to SendGrid or another email service');
      }
    }
    // Don't throw - email failure should not block registration
  }
}
export async function sendRegistrationInitiatedEmail(team: ITeam): Promise<void> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .greeting {
            padding: 25px 40px;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
          }
          .content {
            padding: 40px;
          }
          .registration-id {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .registration-id p {
            font-size: 12px;
            opacity: 0.9;
            margin-bottom: 10px;
          }
          .registration-id .id-value {
            font-size: 32px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
          }
          .section {
            margin: 30px 0;
          }
          .section h2 {
            font-size: 16px;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #666;
            font-weight: 500;
          }
          .detail-value {
            color: #333;
            font-weight: 600;
          }
          .team-members {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
          }
          .team-member-item {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            font-size: 14px;
          }
          .team-member-item:last-child {
            border-bottom: none;
          }
          .team-member-name {
            font-weight: 600;
            color: #333;
          }
          .team-member-email {
            color: #666;
            font-size: 13px;
          }
          .important-note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
            color: #856404;
          }
          .status-badge {
            display: inline-block;
            background: #ffc107;
            color: #333;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
          }
          .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
          .footer-text {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>📝 Registration Initiated</h1>
            <p>ForgeAscend v1.0 – 24-Hour Mega Build-a-thon</p>
          </div>

          <!-- Greeting -->
          <div class="greeting">
            <p>Dear <strong>${team.participant1Name}</strong>,</p>
            <p style="margin-top: 10px; color: #666; font-size: 14px;">Greetings from KLH University, Bachupally Campus.</p>
          </div>

          <!-- Main Content -->
          <div class="content">
            <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">
              Thank you for registering for <strong>ForgeAscend v1.0</strong>, a 24-Hour Mega Build-a-thon.
            </p>
            <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">
              Your registration has been successfully initiated and is currently under verification.
            </p>

            <!-- Registration ID -->
            <div class="registration-id">
              <p>REGISTRATION ID</p>
              <div class="id-value">${team.registrationId}</div>
            </div>

            <!-- Team Information -->
            <div class="section">
              <h2>Team Information</h2>
              <div class="detail-row">
                <span class="detail-label">Team Name:</span>
                <span class="detail-value">${team.teamName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">University:</span>
                <span class="detail-value">${team.collegeName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Campus:</span>
                <span class="detail-value">Bachupally</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Team Size:</span>
                <span class="detail-value">${team.teamSize} Member${team.teamSize !== '1' ? 's' : ''}</span>
              </div>
            </div>

            <!-- Participant Details -->
            <div class="section">
              <h2>Participant Details</h2>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${team.participant1Name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${team.participant1Email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${team.leaderPhone}</span>
              </div>
            </div>

            <!-- Payment -->
            <div class="section">
              <h2>Payment Details</h2>
              <div class="detail-row">
                <span class="detail-label">UTR / Reference ID:</span>
                <span class="detail-value">${team.utrId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value"><span class="status-badge">⏳ Under Verification</span></span>
              </div>
            </div>

            <!-- Important Note -->
            <div class="important-note">
              <strong>📌 Important Note:</strong><br>
              Both registration details and payment are currently pending verification by the organizing team.
              Once the payment and details are successfully verified and approved, you will receive a separate confirmation email.
            </div>

            <p style="color: #333; line-height: 1.6; margin-top: 20px;">
              Thank you for your interest in ForgeAscend v1.0.<br>
              We appreciate your patience and look forward to welcoming you once the verification process is completed.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-text">
              <strong>Warm regards,</strong>
            </div>
            <div class="footer-text">
              Team ForgeAscend v1.0
            </div>
            <div class="footer-text">
              Department of Computer Science & Engineering
            </div>
            <div class="footer-text">
              KLH University, Bachupally Campus
            </div>
            <div class="footer-text" style="margin-top: 15px; opacity: 0.7;">
              © 2026 ForgeAscend v1.0. All rights reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: config.email.user || 'forgeascend@gmail.com',
    to: team.participant1Email,
    subject: `Subject Registration Initiated – ForgeAscend v1.0 Build-a-thon`,
    html: htmlContent,
  };

  try {
    const info = await sendEmailWithRetry(mailOptions);
    console.log(`✅ Registration initiated email sent to ${team.participant1Email}`);
    console.log(`📬 Email response ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ CRITICAL: Failed to send registration initiated email');
    console.error('Recipient:', team.participant1Email);
    console.error('Error type:', error instanceof Error ? error.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && 'code' in error) {
      const code = (error as any).code;
      console.error('Error code:', code);
      if (code === 'ETIMEDOUT') {
        console.error('⚠️  RENDER TIMEOUT: Gmail SMTP unreachable');
        console.error('💡 Solution: Switch to SendGrid or another email service');
      }
    }
    // Don't throw - email failure should not block registration
  }
}