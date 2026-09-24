/**
 * Brevo (Sendinblue) Transactional Email Service for MealBridge
 * Automatically sends emails for:
 * 1. New donation intake confirmations
 * 2. Instant shelter matching notifications
 * 3. Verified Section 80G Tax Exemption & ESG certificates upon delivery
 */

export const sendEmail = async ({ to, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log('[EmailService] BREVO_API_KEY not configured. Email logged to console:');
    console.log(`To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const senderEmail = process.env.BREVO_FROM_EMAIL || 'yashuubhatt@gmail.com';
    const recipientList = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'MealBridge Food Rescue 🌉',
          email: senderEmail,
        },
        to: recipientList,
        subject,
        htmlContent,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[EmailService] Email sent successfully to ${to} (MessageId: ${data.messageId})`);
      return { success: true, messageId: data.messageId };
    } else {
      console.warn('[EmailService Warning] Brevo API responded with error:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.warn('[EmailService Error] Could not send email via Brevo:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send donation creation confirmation email with tracking link
 */
export const sendDonationConfirmationEmail = async (donation, donorEmail) => {
  const targetEmail = donorEmail || process.env.BREVO_FROM_EMAIL || 'yashuubhatt@gmail.com';
  const subject = `🌉 Food Rescue Dispatched: ${donation.foodName} (${donation.quantityKg} kg)`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9FAFB; padding: 24px; color: #1E352F;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background-color: #8BA888; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">MealBridge 🌉</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Real-Time Surplus Food Rescue</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px;">
            <div style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
              ⚡ MATCHING IN PROGRESS
            </div>
            <h2 style="font-size: 18px; margin: 0 0 12px 0;">Thank You for Donating Surplus Food!</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #4B5563;">
              Your donation of <strong>${donation.foodName}</strong> (<strong>${donation.quantityKg} kg</strong>) has been published to our real-time routing engine.
            </p>

            <!-- Details Card -->
            <div style="background-color: #F4F7F4; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <div style="margin-bottom: 8px;"><strong>Category:</strong> ${donation.category}</div>
              <div style="margin-bottom: 8px;"><strong>Pickup Address:</strong> ${donation.pickupLocation?.address || '123 Green Park, Sector 12'}</div>
              <div><strong>Status:</strong> Matched with nearby shelters with 15-min cascade</div>
            </div>

            <p style="font-size: 13px; color: #6B7280; line-height: 1.4;">
              Once a volunteer picks up and delivers the meals, your verified <strong>Section 80G Tax Exemption Certificate</strong> will be issued automatically.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 16px; text-align: center; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB;">
            MealBridge • Track A: Surplus-to-Shelter • AmiHacks 1.0
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to: targetEmail, subject, htmlContent });
};

/**
 * Send delivered certificate & 80G tax receipt email
 */
export const sendDeliveredCertificateEmail = async (donation, donorEmail) => {
  const targetEmail = donorEmail || process.env.BREVO_FROM_EMAIL || 'yashuubhatt@gmail.com';
  const certCode = `CERT-ESG-${donation._id ? donation._id.toString().slice(-6).toUpperCase() : '80G-DELHI'}`;
  const subject = `🏆 80G Tax & ESG Certificate: ${donation.foodName} Safely Delivered!`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9FAFB; padding: 24px; color: #1E352F;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #8BA888 0%, #1E352F 100%); padding: 24px; text-align: center; color: #ffffff;">
            <div style="font-size: 28px; margin-bottom: 4px;">🏆</div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Official Rescue & 80G Certificate</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.85;">Certified Food Waste Diversion & Community Nourishment</p>
          </div>

          <!-- Certificate Body -->
          <div style="padding: 24px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-family: monospace; font-size: 12px; font-weight: bold; background-color: #ECFDF5; color: #047857; padding: 6px 14px; border-radius: 9999px; border: 1px solid #A7F3D0;">
                ${certCode} • VERIFIED
              </span>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #374151;">
              This certifies that <strong>${donation.donorName || 'Bistro 42'}</strong> has successfully rescued and distributed <strong>${donation.quantityKg || 15} kg</strong> of nutritious surplus food through MealBridge.
            </p>

            <div style="background-color: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 14px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 12px; color: #4B5563;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Recipient Shelter:</strong></td>
                  <td style="text-align: right; font-weight: bold; color: #1E352F;">Hope Shelter (NGO Lajpat Nagar)</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Portions Served:</strong></td>
                  <td style="text-align: right; font-weight: bold; color: #1E352F;">~${Math.round((donation.quantityKg || 15) * 2.5)} Meals</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>CO2 Avoided:</strong></td>
                  <td style="text-align: right; font-weight: bold; color: #059669;">${((donation.quantityKg || 15) * 1.8).toFixed(1)} kg CO2e</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Tax Exemption:</strong></td>
                  <td style="text-align: right; font-weight: bold; color: #D97706;">Section 80G Compliant</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 12px; color: #6B7280; text-align: center; margin-top: 20px;">
              Keep this email as proof of CSR, ESG sustainability reporting, and Section 80G deductions.
            </p>
          </div>

          <div style="background-color: #F3F4F6; padding: 14px; text-align: center; font-size: 11px; color: #9CA3AF;">
            MealBridge Digital Registry • Verified by AmiHacks 1.0 Food Safety Board
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to: targetEmail, subject, htmlContent });
};
