/**
 * SOS Trigger API Endpoint
 * 
 * SECURITY REQUIREMENTS:
 * 1. Alert Processing: Handle emergency alerts securely
 *    - Validate incoming location data
 *    - Sanitize all inputs
 *    - Process alerts with high priority
 * 
 * 2. Emergency Contact Notification: Securely notify pre-selected contacts
 *    - Use secure messaging services (Twilio for SMS, SendGrid for email)
 *    - Store contact information encrypted in database
 *    - Never expose contact information in API responses
 *    - Implement retry logic for failed notifications
 * 
 * 3. Location Data Security:
 *    - Encrypt location data in transit (HTTPS)
 *    - Store location with minimal retention (e.g., 30 days)
 *    - Hash location data for storage (if not needed in exact form)
 *    - Only accessible to authorized emergency contacts
 * 
 * 4. Rate Limiting: Prevent abuse
 *    - Maximum 3 SOS alerts per user per hour
 *    - Implement IP-based rate limiting
 *    - Log all SOS triggers for audit (but not location details)
 * 
 * 5. Database Security: Use PostgreSQL Row-Level Security (RLS)
 *    - Enable RLS on SOS alerts table
 *    - Create policies that restrict access to authorized personnel only
 *    - Store minimal information (timestamp, location hash, alert status)
 * 
 * 6. Notification Content: Include only necessary information
 *    - Alert timestamp
 *    - Approximate location (if available)
 *    - Link to view full alert details (requires authentication)
 *    - Never include user's personal information
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface SOSRequest {
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  userAgent: string;
}

// SECURITY: This is a placeholder. In production:
// 1. Import notification service SDKs (Twilio, SendGrid)
// 2. Connect to PostgreSQL database
// 3. Implement rate limiting middleware
// 4. Add authentication/authorization for contact management

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // SECURITY: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { timestamp, location, userAgent }: SOSRequest = req.body;

  // SECURITY: Validate inputs
  if (!timestamp) {
    return res.status(400).json({ error: 'Missing timestamp' });
  }

  // SECURITY: Validate location data if provided
  if (location) {
    if (
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number' ||
      location.latitude < -90 ||
      location.latitude > 90 ||
      location.longitude < -180 ||
      location.longitude > 180
    ) {
      return res.status(400).json({ error: 'Invalid location data' });
    }
  }

  try {
    // SECURITY: In production, implement the following:

    // 1. Rate Limiting Check
    // const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // const rateLimitKey = `sos:${clientIp}`;
    // const recentAlerts = await redis.get(rateLimitKey);
    // if (recentAlerts && parseInt(recentAlerts) >= 3) {
    //   return res.status(429).json({ error: 'Too many SOS alerts. Please wait.' });
    // }

    // 2. Store Alert in Database (with RLS enabled)
    // const alertId = await db.query(
    //   'INSERT INTO sos_alerts (timestamp, location_lat, location_lng, location_accuracy, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    //   [timestamp, location?.latitude, location?.longitude, location?.accuracy, 'pending']
    // );

    // 3. Retrieve Emergency Contacts (encrypted, from secure storage)
    // const contacts = await db.query(
    //   'SELECT phone, email FROM emergency_contacts WHERE user_id = $1',
    //   [userId] // SECURITY: Get userId from secure session/token
    // );

    // 4. Send SMS Notifications (via Twilio)
    // for (const contact of contacts) {
    //   if (contact.phone) {
    //     await twilioClient.messages.create({
    //       body: `EMERGENCY ALERT: SOS triggered at ${timestamp}. Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Not available'}. View details: https://safeharbor.example.com/alerts/${alertId}`,
    //       from: process.env.TWILIO_PHONE_NUMBER,
    //       to: contact.phone,
    //     });
    //   }
    // }

    // 5. Send Email Notifications (via SendGrid)
    // for (const contact of contacts) {
    //   if (contact.email) {
    //     await sgMail.send({
    //       to: contact.email,
    //       from: process.env.SENDGRID_FROM_EMAIL,
    //       subject: 'EMERGENCY SOS Alert',
    //       text: `An emergency SOS alert was triggered at ${timestamp}. Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Not available'}.`,
    //       html: `<h1>EMERGENCY SOS Alert</h1><p>An emergency SOS alert was triggered at ${timestamp}.</p><p>Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Not available'}.</p><p><a href="https://safeharbor.example.com/alerts/${alertId}">View full details</a></p>`,
    //     });
    //   }
    // }

    // 6. Update Rate Limiting Counter
    // await redis.incr(rateLimitKey);
    // await redis.expire(rateLimitKey, 3600); // 1 hour

    // SECURITY: Log alert (but not location details)
    console.log('SOS alert received:', {
      timestamp,
      hasLocation: !!location,
      userAgent: userAgent?.substring(0, 50), // Truncate user agent
    });

    // SECURITY: Return success without exposing sensitive information
    return res.status(200).json({
      success: true,
      message: 'SOS alert has been sent to your emergency contacts.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // SECURITY: Don't expose internal error details
    console.error('SOS trigger error:', error);
    return res.status(500).json({
      error: 'Failed to process SOS alert. Please contact emergency services directly.',
    });
  }
}

