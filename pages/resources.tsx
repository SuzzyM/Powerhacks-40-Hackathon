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
  // NOTE: Types map to the filter dropdown (hotlines, legal, tech-safety, etc.)
  type:
    | 'hotline'
    | 'legal'
    | 'tech-safety'
    | 'forensics'
    | 'local-agency'
    | 'counseling';
  phone?: string;
  website?: string;
  location?: string;
  description: string;
}

interface StoryResource {
  id: string;
  title: string;
  type: 'video' | 'article';
  url: string;
  source: string;
  summary: string;
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

  const storyResources: StoryResource[] = [
    {
      id: 'story-1',
      title: 'Rebuilding After Online Abuse – Survivor Tech Safety Story',
      type: 'video',
      url: 'https://www.youtube.com/results?search_query=survivor+story+online+abuse+and+recovery',
      source: 'YouTube – curated search',
      summary:
        'Short talks and survivor stories about recognizing digital abuse, documenting it safely, and rebuilding a secure digital life.',
    },
    {
      id: 'story-2',
      title: 'Escaping Digital Stalking – How Survivors Took Back Control',
      type: 'article',
      url: 'https://duckduckgo.com/?q=survivor+story+digital+stalking+and+tech+safety',
      source: 'DuckDuckGo – curated search',
      summary:
        'Articles describing how survivors identified spyware, secured their devices, and worked with advocates to stay safer.',
    },
    {
      id: 'story-3',
      title: 'Surviving Image-Based Abuse (Non-Consensual Sharing)',
      type: 'article',
      url: 'https://duckduckgo.com/?q=survivor+story+image+based+abuse+revenge+porn+support',
      source: 'Digital safety organizations',
      summary:
        'Real stories about people whose private images were shared without consent and the legal, emotional, and technical support that helped them.',
    },
    {
      id: 'story-4',
      title: 'From Constant Monitoring to Digital Freedom',
      type: 'video',
      url: 'https://www.youtube.com/results?search_query=coercive+control+technology+survivor+story',
      source: 'YouTube – curated search',
      summary:
        'Survivors explaining how they recognized tech-based coercive control and worked with advocates to regain privacy.',
    },
  ];

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
    {
      id: '3',
      name: 'Technology Safety Specialists (Online Safety Helplines)',
      type: 'tech-safety',
      website: 'https://duckduckgo.com/?q=technology+safety+specialist+domestic+violence',
      description:
        'Professionals and advocates who help survivors lock down phones, social media, email, and devices after digital harm.',
    },
    {
      id: '4',
      name: 'Digital Forensic Experts (Evidence Preservation)',
      type: 'forensics',
      website: 'https://duckduckgo.com/?q=digital+forensics+expert+cyber+stalking+support',
      description:
        'Specialists who can help safely collect, preserve, and document digital evidence (messages, logs, images) for investigations.',
    },
    {
      id: '5',
      name: 'Cyber-Law & Online Safety Attorneys',
      type: 'legal',
      website: 'https://duckduckgo.com/?q=cyber+law+attorney+online+harassment',
      description:
        'Lawyers experienced with cyberstalking, image-based abuse, online harassment, and privacy violations.',
    },
    {
      id: '6',
      name: 'Local Domestic Violence & Sexual Assault Agencies',
      type: 'local-agency',
      website: 'https://duckduckgo.com/?q=local+domestic+violence+agency+near+me',
      description:
        'Local agencies that can connect you with counselors, legal advocates, and tech-safety support in your area.',
    },
    {
      id: '7',
      name: 'Crisis Counseling & Trauma-Informed Therapists',
      type: 'counseling',
      website: 'https://duckduckgo.com/?q=trauma+informed+therapist+online+abuse',
      description:
        'Counselors who understand digital harm and can support you emotionally as you recover and rebuild your digital life.',
    },
  ];

  const handleSearch = () => {
    // Placeholder: In production, this would call /api/resources with search params
    // For now, do a simple client-side filter by type and search text.
    const query = searchQuery.trim().toLowerCase();

    const filtered = mockResources.filter((resource) => {
      const matchesType = filterType === 'all' || resource.type === filterType;
      const matchesQuery =
        !query ||
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        (resource.location && resource.location.toLowerCase().includes(query));

      return matchesType && matchesQuery;
    });

    setResources(filtered);
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

            {/* Survivor Stories: Videos & Articles */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Stories of Digital Harm, Survival & Recovery
              </h2>
              <p className="text-gray-700 mb-4">
                These links point to videos and articles where people describe how they experienced
                digital harm (online abuse, stalking, image-based abuse) and the concrete steps they
                took to stay safer, get support, and rebuild their lives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storyResources.map((story) => (
                  <a
                    key={story.id}
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {story.title}
                      </h3>
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        {story.type === 'video' ? 'Video' : 'Article'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{story.summary}</p>
                    <p className="text-xs text-gray-500">
                      Source: <span className="font-medium">{story.source}</span>
                    </p>
                  </a>
                ))}
              </div>
            </section>

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
                  <option value="tech-safety">Tech Safety Specialists</option>
                  <option value="forensics">Digital Forensic Experts</option>
                  <option value="legal">Cyber-Law / Legal Aid</option>
                  <option value="local-agency">Local Support Agencies</option>
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

