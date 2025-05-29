// components/Mermaid.tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  //ChatGPT
  useEffect(() => {
    if (containerRef.current) {
      try {
        mermaid.initialize({ startOnLoad: false });
        mermaid.render('generatedDiagram', chart, (svgCode) => {
          containerRef.current!.innerHTML = svgCode;
        });
      } catch (error) {
        console.error('Error rendering Mermaid chart:', error);
      }
    }
  }, [chart]);

  //Claude
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

  //Gemini
    useEffect(() => {
    if (mermaidRef.current) {
      // Clear previous content
      mermaidRef.current.innerHTML = '';

      try {
        // Initialize Mermaid (important for each render if themes or config change)
        mermaid.initialize({ startOnLoad: false });

        // Render the chart
        // The third argument (callback) can be used for post-render operations,
        // but often not necessary for basic rendering.
        mermaid.render(
          'mermaid-chart', // A unique ID for the SVG
          chart,
          (svgCode) => {
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = svgCode;
            }
          }
        );
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<pre style="color: red;">Error rendering Mermaid diagram: ${error.message}</pre>`;
        }
      }
    }
  }, [chart]); // Re-render if the 'chart' prop changes

  return <div ref={containerRef} />;
};

export default Mermaid;


// pages/DiagramPage.tsx or any component
import React from 'react';
import Mermaid from './components/Mermaid';

const diagram = `
  graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`;

const DiagramPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mermaid Diagram</h1>
      <Mermaid chart={diagram} />
    </div>
  );
};

export default DiagramPage;
