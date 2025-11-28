import Head from 'next/head';
import { useState } from 'react';
import QuickExitButton from '@/src/components/QuickExitButton';

/**
 * Resources Page
 * 
 * SECURITY: This page provides a searchable directory of support resources.
 * All data should be stored securely and validated server-side.
 * 
 * In production:
 * 1. Implement server-side search with input sanitization
 * 2. Store resource data in PostgreSQL with RLS enabled
 * 3. Never log user searches or resource access
 * 4. Implement rate limiting on search requests
 */
interface Resource {
  id: string;
  name: string;
  type: 'hotline' | 'legal' | 'shelter' | 'counseling';
  phone?: string;
  website?: string;
  location?: string;
  description: string;
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [resources, setResources] = useState<Resource[]>([]);

  // SECURITY: This is a placeholder. In production:
  // 1. Fetch resources from /api/resources endpoint
  // 2. Implement server-side search and filtering
  // 3. Sanitize all user inputs
  // 4. Use parameterized queries to prevent SQL injection

  const mockResources: Resource[] = [
    {
      id: '1',
      name: 'National Domestic Violence Hotline',
      type: 'hotline',
      phone: '1-800-799-7233',
      website: 'https://www.thehotline.org',
      description: '24/7 confidential support for victims of domestic violence',
    },
    {
      id: '2',
      name: 'Legal Aid Society',
      type: 'legal',
      phone: '1-800-XXX-XXXX',
      description: 'Free legal assistance for those in need',
    },
  ];

  const handleSearch = () => {
    // Placeholder: In production, this would call /api/resources with search params
    setResources(mockResources);
  };

  return (
    <>
      <Head>
        <title>Resources - SafeHarbor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Support Resources
            </h1>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="hotline">Hotlines</option>
                  <option value="legal">Legal Aid</option>
                  <option value="shelter">Shelters</option>
                  <option value="counseling">Counseling</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
              {resources.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600">
                    Use the search above to find resources in your area.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    (Search functionality placeholder - to be connected to backend)
                  </p>
                </div>
              ) : (
                resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {resource.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {resource.phone && (
                        <span className="text-blue-600">
                          📞 {resource.phone}
                        </span>
                      )}
                      {resource.website && (
                        <a
                          href={resource.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          🌐 Website
                        </a>
                      )}
                      {resource.location && (
                        <span className="text-gray-500">
                          📍 {resource.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Privacy:</strong> Your searches are not logged or stored.
                All resource data is publicly available information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

