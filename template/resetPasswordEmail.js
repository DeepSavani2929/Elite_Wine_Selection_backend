const resetPasswordEmailTemplate = (resetLink) => {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" 
    style="background:#ffffff; padding:40px 0; font-family:Arial, sans-serif;">
    <tr>
      <td align="center">

        <!-- Outer container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" 
               style="text-align:left;">

          <!-- Title -->
          <tr>
            <td style="font-size:28px; color:#222222; padding-bottom:25px;">
              elite wine selections
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="font-size:22px; color:#222222; padding-bottom:15px;">
              Reset your password
            </td>
          </tr>

          <!-- Paragraph -->
          <tr>
            <td style="font-size:16px; color:#555555; line-height:24px; padding-right:40px;">

              Follow this link to reset your customer account password at
              <a href="https://elitewineselections.com" style="color:#1a73e8; text-decoration:underline;">
                elite wine selections
              </a>.
              If you didn't request a new password, you can safely delete this email.

            </td>
          </tr>

          <!-- Button + “or Visit our store” -->
          <tr>
            <td style="padding-top:28px;">

              <table cellpadding="0" cellspacing="0" border="0">
                <tr>

                  <!-- Reset button -->
                  <td>
                    <a href="${resetLink}"
                      style="background:#1E88E5; padding:12px 30px; 
                      color:white; font-size:15px; text-decoration:none;
                      border-radius:4px; display:inline-block;">
                      Reset your password
                    </a>
                  </td>

                  <!-- Spacer -->
                  <td width="12"></td>

                  <!-- OR + Visit store -->
                  <td style="font-size:15px; color:#555;">
                    or 
                    <a href="http://localhost:5173" 
                       style="color:#1a73e8; text-decoration:underline;">
                      Visit our store
                    </a>
                  </td>

                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:45px 0 35px;">
              <hr style="border:0; border-top:1px solid #dddddd;">
            </td>
          </tr>

          <!-- Footer Text -->
          <tr>
            <td style="font-size:14px; color:#777777; line-height:22px;">
              If you have any questions, reply to this email or contact us at 
              <a href="mailto:sebastian.huelck@example.com" 
                 style="color:#1a73e8; text-decoration:underline;">
                sebastian.huelck@example.com
              </a>
            </td>
          </tr>

          <!-- Website Footer -->
          <tr>
            <td style="font-size:14px; color:#1a73e8; padding-top:8px;">
              <a href="https://elitewineselections.com" 
                 style="color:#1a73e8; text-decoration:underline;">
                elitewineselections.com
              </a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `;
};

module.exports = resetPasswordEmailTemplate;
