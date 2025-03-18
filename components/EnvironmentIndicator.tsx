import { environment, showDebugInfo } from '@/lib/environment';

/**
 * A component that displays the current environment (development, preview, production)
 * Only visible in non-production environments
 */
export default function EnvironmentIndicator() {
  // Don't show in production or if debug info is disabled
  if (!showDebugInfo()) {
    return null;
  }

  const { name } = environment;
  
  // Different colors for different environments
  const bgColor = 
    name === 'Development' ? 'bg-blue-500' : 
    name === 'Preview/Staging' ? 'bg-amber-500' : 
    'bg-green-500';

  return (
    <div className={`fixed bottom-2 right-2 z-50 ${bgColor} text-white text-xs px-2 py-1 rounded-md opacity-75 hover:opacity-100 transition-opacity`}>
      {name}
    </div>
  );
}
