import nodemailer from 'nodemailer';

// Create transporter for sending emails
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send welcome email with password
export const sendWelcomeEmail = async (email, password, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your Store'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Our Store - Your Account Details',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .credentials {
              background-color: #f5f5f5;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .password {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
              text-align: center;
              padding: 10px;
              background-color: #e9ecef;
              border-radius: 5px;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1>Welcome to Our Store!</h1>
              </div>

              <p>Hi ${name || 'there'},</p>

              <p>Thank you for creating an account with us. Your account has been successfully created!</p>

              <div class="credentials">
                <h3>Your Login Details:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong></p>
                <div class="password">${password}</div>
              </div>

              <p><strong>Important:</strong> Please keep this email safe and consider changing your password after your first login.</p>

              <p>You can now login to your account and start shopping!</p>

              <p>If you have any questions or need assistance, feel free to contact us.</p>

              <p>Happy Shopping!</p>

              <div class="footer">
                <p>This is an automated email. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Our Store!

        Hi ${name || 'there'},

        Thank you for creating an account with us. Your account has been successfully created!

        Your Login Details:
        Email: ${email}
        Password: ${password}

        Important: Please keep this email safe and consider changing your password after your first login.

        You can now login to your account and start shopping!

        If you have any questions or need assistance, feel free to contact us.

        Happy Shopping!
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send order confirmation email to customer
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = createTransporter();

    const { order_id, customer_name, customer_email, order_items, total_amount, shipping_address, shipping_city, shipping_postal_code, payment_method, created_at } = orderData;

    const itemsHtml = order_items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${(item.price).toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Mohit Computers" <${process.env.EMAIL_USER}>`,
      to: customer_email,
      subject: `Order Confirmation - ${order_id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .content { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .order-id { font-size: 24px; font-weight: bold; color: #14b8a6; margin: 20px 0; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
            .info-box { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0891b2; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1>✅ Order Confirmed!</h1>
                <p>Thank you for your order</p>
              </div>

              <p>Hi ${customer_name},</p>
              <p>Your order has been successfully placed! We'll call you within 24 hours to confirm.</p>

              <div class="order-id">Order ID: ${order_id}</div>

              <div class="info-box">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order Date:</strong> ${new Date(created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p><strong>Payment Method:</strong> ${payment_method}</p>
              </div>

              <h3>Items Ordered</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total">
                Total Amount: Rs ${parseFloat(total_amount).toLocaleString()}
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0;">🚚 Delivery Address</h3>
                <p>${shipping_address}<br>
                ${shipping_city}${shipping_postal_code ? ', ' + shipping_postal_code : ''}</p>
              </div>

              <div class="info-box" style="background-color: #fef3c7; border-left-color: #f59e0b;">
                <h3 style="margin-top: 0;">📦 What's Next?</h3>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>We'll call you within 24 hours to confirm your order</li>
                  <li>Your order will be carefully packed and dispatched</li>
                  <li>Delivery within 2-5 business days</li>
                  <li>Pay cash when you receive your order</li>
                </ol>
              </div>

              <p style="margin-top: 30px;">If you have any questions, contact us:</p>
              <p>
                📞 Phone: 0336 8900349<br>
                📧 Email: info@mohitcomputers.pk<br>
                📍 Address: Suite 316-B, Regal Trade Square, Saddar, Karachi
              </p>

              <div class="footer">
                <p>Thank you for shopping with Mohit Computers!</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send new order notification to admin
export const sendAdminOrderNotification = async (orderData) => {
  try {
    const transporter = createTransporter();

    const { order_id, customer_name, customer_email, customer_phone, order_items, total_amount, shipping_address, shipping_city, payment_method, created_at } = orderData;

    const itemsHtml = order_items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Mohit Computers Orders" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🔔 New Order Received - ${order_id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .content { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .order-id { font-size: 24px; font-weight: bold; color: #dc2626; margin: 20px 0; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; }
            .info-box { background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc2626; }
            .customer-info { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #0891b2; }
            .total { font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 20px; text-align: right; }
            .action-button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1>🔔 New Order Received!</h1>
                <p>A new order has been placed on your website</p>
              </div>

              <div class="order-id">Order ID: ${order_id}</div>

              <div class="info-box">
                <p><strong>⏰ Order Time:</strong> ${new Date(created_at).toLocaleString('en-PK')}</p>
                <p><strong>💳 Payment Method:</strong> ${payment_method}</p>
                <p><strong>📊 Status:</strong> Pending</p>
              </div>

              <div class="customer-info">
                <h3 style="margin-top: 0;">👤 Customer Information</h3>
                <p><strong>Name:</strong> ${customer_name}</p>
                <p><strong>Email:</strong> ${customer_email}</p>
                <p><strong>Phone:</strong> ${customer_phone}</p>
                <p><strong>Address:</strong> ${shipping_address}, ${shipping_city}</p>
              </div>

              <h3>📦 Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total">
                💰 Total Amount: Rs ${parseFloat(total_amount).toLocaleString()}
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" class="action-button">
                  View in Admin Panel
                </a>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
                <p>This is an automated notification from Mohit Computers</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update email to customer
export const sendOrderStatusUpdateEmail = async (orderData, newStatus) => {
  try {
    const transporter = createTransporter();

    const { order_id, customer_name, customer_email, order_items, total_amount, shipping_address, shipping_city } = orderData;

    // Status messages and colors
    const statusInfo = {
      pending: {
        title: '⏳ Order Pending',
        message: 'Your order has been received and is pending confirmation.',
        color: '#f59e0b',
        icon: '⏳',
        nextSteps: [
          'We are reviewing your order details',
          'Our team will contact you shortly for confirmation',
          'Please keep your phone accessible'
        ]
      },
      confirmed: {
        title: '✅ Order Confirmed',
        message: 'Great news! Your order has been confirmed.',
        color: '#3b82f6',
        icon: '✅',
        nextSteps: [
          'Your order is now in our processing queue',
          'We will prepare your items for shipment',
          'You will receive updates as we progress'
        ]
      },
      processing: {
        title: '📦 Order Processing',
        message: 'Your order is being prepared for shipment.',
        color: '#8b5cf6',
        icon: '📦',
        nextSteps: [
          'Items are being carefully packed',
          'Quality check is in progress',
          'Will be handed over to courier soon'
        ]
      },
      shipped: {
        title: '🚚 Order Shipped',
        message: 'Your order is on its way!',
        color: '#0891b2',
        icon: '🚚',
        nextSteps: [
          'Your package is with our courier partner',
          'Expected delivery in 2-5 business days',
          'You can track your shipment',
          'Keep cash ready for COD payment'
        ]
      },
      delivered: {
        title: '🎉 Order Delivered',
        message: 'Your order has been successfully delivered!',
        color: '#16a34a',
        icon: '🎉',
        nextSteps: [
          'Thank you for shopping with us',
          'We hope you enjoy your purchase',
          'Please share your feedback',
          'Visit us again for more great deals'
        ]
      },
      cancelled: {
        title: '❌ Order Cancelled',
        message: 'Your order has been cancelled.',
        color: '#dc2626',
        icon: '❌',
        nextSteps: [
          'Your order has been cancelled as requested',
          'No charges will be applied',
          'If you have any questions, please contact us',
          'We hope to serve you again soon'
        ]
      }
    };

    const status = statusInfo[newStatus] || statusInfo.pending;
    const itemsHtml = order_items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;">Rs ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const nextStepsHtml = status.nextSteps.map(step => `<li style="margin: 8px 0;">${step}</li>`).join('');

    const mailOptions = {
      from: `"Mohit Computers" <${process.env.EMAIL_USER}>`,
      to: customer_email,
      subject: `${status.title} - ${order_id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .content { background-color: white; padding: 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background-color: ${status.color}; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
            .body-content { padding: 30px; }
            .order-id { font-size: 20px; font-weight: bold; color: ${status.color}; margin: 20px 0; text-align: center; padding: 15px; background-color: ${status.color}15; border-radius: 8px; }
            .status-message { background-color: ${status.color}20; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${status.color}; }
            .status-message h3 { margin-top: 0; color: ${status.color}; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; font-size: 14px; }
            .info-section { margin: 25px 0; }
            .info-section h3 { color: #333; font-size: 18px; margin-bottom: 15px; }
            .next-steps { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .next-steps ul { margin: 10px 0; padding-left: 20px; }
            .contact-box { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .contact-box p { margin: 8px 0; font-size: 14px; }
            .footer { text-align: center; padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1>${status.icon} ${status.title}</h1>
                <p>${status.message}</p>
              </div>

              <div class="body-content">
                <p style="font-size: 16px;">Hi <strong>${customer_name}</strong>,</p>
                <p style="font-size: 16px;">Your order status has been updated!</p>

                <div class="order-id">Order ID: ${order_id}</div>

                <div class="status-message">
                  <h3>Current Status: ${newStatus.toUpperCase()}</h3>
                  <p style="margin: 5px 0;">${status.message}</p>
                </div>

                <div class="info-section">
                  <h3>📦 Order Summary</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
                        <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px; color: ${status.color};">Rs ${parseFloat(total_amount).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div class="next-steps">
                  <h3 style="margin-top: 0; color: #0891b2;">📋 What's Next?</h3>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    ${nextStepsHtml}
                  </ul>
                </div>

                <div class="info-section">
                  <h3>🚚 Delivery Address</h3>
                  <p style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    ${shipping_address}<br>
                    ${shipping_city}
                  </p>
                </div>

                <div class="contact-box">
                  <h4 style="margin-top: 0; color: #333;">Need Help?</h4>
                  <p>📞 <strong>Phone:</strong> 0336 8900349</p>
                  <p>📧 <strong>Email:</strong> info@mohitcomputers.pk</p>
                  <p>📍 <strong>Address:</strong> Suite 316-B, Regal Trade Square, Saddar, Karachi</p>
                </div>
              </div>

              <div class="footer">
                <p>Thank you for shopping with <strong>Mohit Computers</strong></p>
                <p>This is an automated email. Please do not reply directly to this message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin password email
export const sendAdminPasswordEmail = async (email, password) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Mohit Computers Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Admin Password - Mohit Computers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .content {
              background-color: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #0891b2;
            }
            .password-box {
              background-color: #f0f9ff;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #0891b2;
              margin: 20px 0;
            }
            .password {
              font-size: 24px;
              font-weight: bold;
              color: #0369a1;
              letter-spacing: 2px;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1 style="color: #0891b2; margin: 0;">Admin Password Recovery</h1>
                <p style="color: #6b7280; margin-top: 10px;">Mohit Computers Admin Panel</p>
              </div>

              <p>Hello Admin,</p>
              <p>You requested your admin password. Here are your login credentials:</p>

              <div class="password-box">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #374151;">Your Password:</p>
                <div class="password">${password}</div>
              </div>

              <p style="margin-top: 20px;"><strong>Security Notice:</strong></p>
              <ul style="color: #6b7280;">
                <li>Keep this password secure and confidential</li>
                <li>Do not share this password with anyone</li>
                <li>Consider changing your password after logging in</li>
                <li>If you didn't request this, please contact support immediately</li>
              </ul>

              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin-top: 20px;">
                <p style="margin: 0; color: #991b1b;"><strong>⚠️ Important:</strong> This is a security-sensitive email. Please delete it after noting down your password.</p>
              </div>

              <div class="footer">
                <p>This is an automated email from Mohit Computers Admin Panel.</p>
                <p>If you did not request this password, please ignore this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin password email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin password email:', error);
    return { success: false, error: error.message };
  }
};

// Send user password reset email (forgot password)
export const sendUserPasswordResetEmail = async (email, password, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Mohit Computers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password - Mohit Computers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .content {
              background-color: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }
            .password-box {
              background-color: #eff6ff;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
              margin: 20px 0;
            }
            .password {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              letter-spacing: 2px;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <h1 style="color: #3b82f6; margin: 0;">Password Recovery</h1>
                <p style="color: #6b7280; margin-top: 10px;">Mohit Computers</p>
              </div>

              <p>Hello ${name || 'Customer'},</p>
              <p>You requested a password reset. We've generated a new temporary password for your account:</p>

              <div class="password-box">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #374151;">Your New Temporary Password:</p>
                <div class="password">${password}</div>
              </div>

              <p style="margin-top: 20px;">You can now log in to your account using this password. <strong>Please change this password after logging in.</strong></p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Login to Your Account</a>
              </div>

              <p style="margin-top: 20px;"><strong>Security Tips:</strong></p>
              <ul style="color: #6b7280;">
                <li>Keep your password secure and don't share it with anyone</li>
                <li>Consider changing your password after logging in</li>
                <li>Use a strong, unique password for your account</li>
              </ul>

              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin-top: 20px;">
                <p style="margin: 0; color: #991b1b;"><strong>⚠️ Didn't request this?</strong> If you didn't request a password reset, please contact us immediately.</p>
              </div>

              <div class="footer">
                <p>Thank you for shopping with Mohit Computers!</p>
                <p>This is an automated email. Please do not reply directly to this message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('User password email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending user password email:', error);
    return { success: false, error: error.message };
  }
};

// Send corporate inquiry email to admin
export const sendCorporateInquiryEmail = async (data) => {
  try {
    const transporter = createTransporter();
    const { name, email, phone, whatsapp, message, interests } = data;

    const interestsList = interests && interests.length > 0
      ? interests.join(', ')
      : 'Not specified';

    const mailOptions = {
      from: `"Mohit Computers Corporate" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      replyTo: email,
      subject: `Corporate Inquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #0d9488; margin-bottom: 5px; }
            .field-value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #0d9488; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏢 New Corporate Inquiry</h1>
              <p>From Mohit Computers Corporate Form</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">${email}</div>
              </div>
              <div class="field">
                <div class="field-label">Phone:</div>
                <div class="field-value">${phone || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">WhatsApp:</div>
                <div class="field-value">${whatsapp || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Interested In:</div>
                <div class="field-value">${interestsList}</div>
              </div>
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value">${message || 'No message provided'}</div>
              </div>
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                This email was sent from the Corporate Inquiry form on Mohit Computers website.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Corporate inquiry email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending corporate inquiry email:', error);
    return { success: false, error: error.message };
  }
};

// Send contact form inquiry email to admin
export const sendContactInquiryEmail = async (data) => {
  try {
    const transporter = createTransporter();
    const { name, email, subject, message } = data;

    const mailOptions = {
      from: `"Mohit Computers Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      replyTo: email,
      subject: `Contact Form: ${subject || 'General Inquiry'} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #0d9488; margin-bottom: 5px; }
            .field-value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #0d9488; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>From Mohit Computers Contact Page</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">${email}</div>
              </div>
              <div class="field">
                <div class="field-label">Subject:</div>
                <div class="field-value">${subject || 'No subject provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value">${message}</div>
              </div>
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                This email was sent from the Contact form on Mohit Computers website.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact inquiry email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact inquiry email:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter subscription confirmation email
export const sendNewsletterSubscriptionEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Mohit Computers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Mohit Computers Newsletter! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Our Newsletter!</h1>
              <p>Thank you for subscribing to Mohit Computers updates</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; margin-bottom: 20px;">
                You're now part of our tech community! You'll receive:
              </p>
              <ul style="margin: 20px 0; padding-left: 20px;">
                <li style="margin: 10px 0;">📱 Latest product arrivals and deals</li>
                <li style="margin: 10px 0;">💡 Tech tips and recommendations</li>
                <li style="margin: 10px 0;">🎁 Exclusive subscriber-only offers</li>
                <li style="margin: 10px 0;">📰 Tech news and updates</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" class="button">
                  Browse Products
                </a>
              </div>
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                This email confirms your subscription to Mohit Computers newsletter.<br>
                If you didn't subscribe, please ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter subscription email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending newsletter subscription email:', error);
    return { success: false, error: error.message };
  }
};

// Send corporate inquiry confirmation to user
export const sendCorporateConfirmationEmail = async (data) => {
  try {
    const transporter = createTransporter();
    const { name, email } = data;

    const mailOptions = {
      from: `"Mohit Computers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Your Corporate Inquiry - Mohit Computers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Inquiry Received!</h1>
              <p>Thank you for contacting Mohit Computers</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p style="font-size: 16px; margin: 20px 0;">
                Thank you for your corporate inquiry! We have received your request and our team will review it shortly.
              </p>
              <p><strong>What happens next?</strong></p>
              <ul style="margin: 20px 0; padding-left: 20px;">
                <li style="margin: 10px 0;">Our corporate sales team will review your requirements</li>
                <li style="margin: 10px 0;">We'll prepare a customized quote for your business</li>
                <li style="margin: 10px 0;">You'll receive a response within 24-48 business hours</li>
              </ul>
              <p style="margin-top: 20px;">
                In the meantime, feel free to explore our product catalog or contact us directly if you have any urgent questions.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" class="button">
                  Browse Products
                </a>
              </div>
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong>Mohit Computers Team</strong><br>
                Corporate Sales Department
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Corporate confirmation email sent to user:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending corporate confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send contact inquiry confirmation to user
export const sendContactConfirmationEmail = async (data) => {
  try {
    const transporter = createTransporter();
    const { name, email } = data;

    const mailOptions = {
      from: `"Mohit Computers" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Us - Mohit Computers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Message Received!</h1>
              <p>Thank you for contacting Mohit Computers</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p style="font-size: 16px; margin: 20px 0;">
                Thank you for reaching out to us! We have received your message and our support team will get back to you as soon as possible.
              </p>
              <p><strong>What's next?</strong></p>
              <ul style="margin: 20px 0; padding-left: 20px;">
                <li style="margin: 10px 0;">Our team is reviewing your message</li>
                <li style="margin: 10px 0;">We aim to respond within 24 hours</li>
                <li style="margin: 10px 0;">You'll receive a detailed response via email</li>
              </ul>
              <p style="margin-top: 20px;">
                If you have any urgent questions, feel free to call us directly or visit our store.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" class="button">
                  Visit Our Website
                </a>
              </div>
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong>Mohit Computers Team</strong><br>
                Customer Support
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact confirmation email sent to user:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    return { success: false, error: error.message };
  }
};
