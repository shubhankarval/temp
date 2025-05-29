import React, { useEffect, useRef, useState } from 'react';

// First, install mermaid: npm install mermaid @types/mermaid

interface MermaidProps {
  chart: string;
  id?: string;
}

const MermaidDiagram: React.FC<MermaidProps> = ({ chart, id = 'mermaid-diagram' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;
        
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });

        if (ref.current) {
          // Clear previous content
          ref.current.innerHTML = '';
          
          // Generate unique ID for this diagram
          const diagramId = `${id}-${Date.now()}`;
          
          // Render the diagram
          const { svg } = await mermaid.render(diagramId, chart);
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        console.error('Mermaid rendering error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (chart) {
      renderDiagram();
    }
  }, [chart, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-600">
        Loading diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
        Error rendering diagram: {error}
      </div>
    );
  }

  return <div ref={ref} className="w-full" />;
};

export default MermaidDiagram;
