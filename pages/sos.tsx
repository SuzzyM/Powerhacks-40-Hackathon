import Head from 'next/head';
import { useState } from 'react';
import QuickExitButton from '@/src/components/QuickExitButton';

/**
 * Emergency SOS Page
 * 
 * SECURITY REQUIREMENTS:
 * 1. Geolocation: Use browser Geolocation API to get user's location
 *    - Request permission explicitly
 *    - Handle cases where permission is denied
 *    - Only send location data to secure backend endpoint
 * 
 * 2. Alert Transmission: Send alert to /api/sos-trigger endpoint
 *    - Include timestamp, geolocation (if available), and user agent
 *    - Use HTTPS POST request
 *    - Never log sensitive information in client-side code
 * 
 * 3. Server-Side Processing: The /api/sos-trigger endpoint must:
 *    - Validate and sanitize incoming data
 *    - Securely notify pre-selected emergency contacts via email/SMS
 *    - Use a secure messaging service (e.g., Twilio for SMS, SendGrid for email)
 *    - Store alert in database with minimal information (timestamp, location hash)
 *    - Implement rate limiting to prevent abuse
 * 
 * 4. Privacy: Location data should be:
 *    - Encrypted in transit (HTTPS)
 *    - Stored with minimal retention (e.g., 30 days)
 *    - Only accessible to authorized emergency contacts
 */
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function SOS() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [sending, setSending] = useState(false);

  const requestLocation = () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsRequestingLocation(false);
      return;
    }

    // SECURITY: Request high-accuracy location for emergency situations
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || 0,
        });
        setIsRequestingLocation(false);
      },
      (error) => {
        // SECURITY: Handle location errors gracefully
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Alert will be sent without location data.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const triggerSOS = async () => {
    if (!confirm('Are you sure you want to trigger an emergency SOS alert?')) {
      return;
    }

    setSending(true);

    try {
      // SECURITY: Send alert to secure backend endpoint
      const response = await fetch('/api/sos-trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
              }
            : null,
          userAgent: navigator.userAgent,
          // SECURITY: Do NOT send any identifying information
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SOS alert');
      }

      setAlertSent(true);
    } catch (error) {
      console.error('SOS error:', error);
      alert('Failed to send SOS alert. Please try again or contact emergency services directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Head>
        <title>Emergency SOS - SafeHarbor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen high-contrast flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <h1 className="text-5xl font-bold mb-8 text-white">
            Emergency SOS
          </h1>

          {alertSent ? (
            <div className="bg-green-600 text-white p-8 rounded-lg shadow-xl">
              <p className="text-2xl font-semibold mb-4">
                ✓ SOS Alert Sent Successfully
              </p>
              <p className="text-lg mb-4">
                Your emergency alert has been sent to your designated contacts.
              </p>
              <p className="text-sm">
                If this is a life-threatening emergency, please call 911 immediately.
              </p>
            </div>
          ) : (
            <>
              {/* Location Status */}
              <div className="bg-gray-800 text-white p-6 rounded-lg mb-6">
                {location ? (
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      ✓ Location Retrieved
                    </p>
                    <p className="text-sm text-gray-300">
                      Latitude: {location.latitude.toFixed(6)}
                      <br />
                      Longitude: {location.longitude.toFixed(6)}
                      <br />
                      Accuracy: ±{Math.round(location.accuracy)}m
                    </p>
                  </div>
                ) : locationError ? (
                  <div>
                    <p className="text-lg font-semibold mb-2 text-yellow-400">
                      ⚠ Location Unavailable
                    </p>
                    <p className="text-sm text-gray-300">{locationError}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      Location Not Yet Retrieved
                    </p>
                    <p className="text-sm text-gray-300">
                      Click the button below to get your location, or proceed without it.
                    </p>
                  </div>
                )}

                {!location && !isRequestingLocation && (
                  <button
                    onClick={requestLocation}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
                  >
                    Get My Location
                  </button>
                )}

                {isRequestingLocation && (
                  <p className="mt-4 text-gray-300">Requesting location...</p>
                )}
              </div>

              {/* Main SOS Button */}
              <button
                onClick={triggerSOS}
                disabled={sending}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold text-3xl py-8 px-16 rounded-lg shadow-2xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                {sending ? 'Sending Alert...' : 'TRIGGER SILENT SOS'}
              </button>

              <p className="mt-8 text-yellow-400 text-lg font-semibold">
                ⚠ This will send an alert to your emergency contacts
              </p>
              <p className="mt-4 text-gray-300 text-sm">
                If this is a life-threatening emergency, call 911 immediately.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

