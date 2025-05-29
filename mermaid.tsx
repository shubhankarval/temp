// components/Mermaid.tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
