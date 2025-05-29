import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ZoomableCanvas = () => {
  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <div className="w-full max-w-6xl mx-auto h-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Zoomable Canvas</h1>
        
        <Card className="w-full h-5/6 overflow-hidden">
          <CardContent className="p-0 h-full">
          <TransformWrapper
            initialScale={1}
            minScale={0.1}
            maxScale={5}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: false, step: 0.7 }}
            centerOnInit={true}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Control Buttons */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => zoomIn(0.2)}
                    title="Zoom In"
                  >
                    <ZoomIn size={20} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => zoomOut(0.2)}
                    title="Zoom Out"
                  >
                    <ZoomOut size={20} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => resetTransform()}
                    title="Reset Zoom"
                  >
                    <RotateCcw size={20} />
                  </Button>
                  </CardContent>
        </Card>

                {/* Zoomable Content */}
                <TransformComponent
                  wrapperClass="w-full h-full"
                  contentClass="w-full h-full"
                >
                  <div 
                    className="w-full h-full relative"
                    style={{
                      backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0',
                      minHeight: '200vh',
                      minWidth: '200vw'
                    }}
                  >
                    {/* Sample Content - Replace with your canvas items */}
                    <div className="absolute top-20 left-20 w-48 h-32 bg-blue-100 border-2 border-blue-300 rounded-lg p-4 shadow-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Sample Card 1</h3>
                      <p className="text-sm text-blue-600">This is a sample element on the canvas. You can zoom and pan around.</p>
                    </div>
                    
                    <div className="absolute top-60 left-80 w-48 h-32 bg-green-100 border-2 border-green-300 rounded-lg p-4 shadow-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Sample Card 2</h3>
                      <p className="text-sm text-green-600">Another element to demonstrate the canvas functionality.</p>
                    </div>
                    
                    <div className="absolute top-40 left-96 w-48 h-32 bg-purple-100 border-2 border-purple-300 rounded-lg p-4 shadow-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Sample Card 3</h3>
                      <p className="text-sm text-purple-600">Try using mouse wheel to zoom or drag to pan!</p>
                    </div>
                    
                    <div className="absolute top-80 left-20 w-48 h-32 bg-red-100 border-2 border-red-300 rounded-lg p-4 shadow-lg">
                      <h3 className="font-semibold text-red-800 mb-2">Sample Card 4</h3>
                      <p className="text-sm text-red-600">The dotted background helps with spatial awareness.</p>
                    </div>
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Controls:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Mouse wheel or trackpad: Zoom in/out</li>
            <li>Click and drag: Pan around the canvas</li>
            <li>Double-click: Quick zoom</li>
            <li>Use the buttons in the top-left for precise control</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ZoomableCanvas;
