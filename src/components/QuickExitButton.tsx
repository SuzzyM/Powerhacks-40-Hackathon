import React from 'react';

/**
 * QuickExitButton Component
 * 
 * SECURITY: This button provides an immediate exit mechanism for users
 * who need to quickly leave the site. It redirects to an innocuous website
 * to prevent detection of site usage.
 * 
 * The redirect URL should be changed to a generic, commonly visited site
 * (e.g., a search engine or news site) that won't raise suspicion.
 */
const QuickExitButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const handleQuickExit = () => {
    // SECURITY: Redirect to an innocuous website immediately
    // Change this URL to a generic, commonly visited site
    window.location.href = 'https://www.google.com';
  };

  return (
    <button
      onClick={handleQuickExit}
      className={`
        ${className}
        bg-red-600 hover:bg-red-700 
        text-white font-bold 
        py-2 px-4 rounded 
        transition-colors duration-200
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      `}
      aria-label="Quick Exit - Leave this site immediately"
    >
      🚪 Quick Exit
    </button>
  );
};

export default QuickExitButton;

