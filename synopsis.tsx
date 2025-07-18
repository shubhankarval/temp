import { ChevronDown, ChevronUp } from 'lucide-react';

// Option 2: Modern Dark Gradient
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const contentRef = useRef(null);
  const maxHeight = 200; // Maximum height in pixels before showing toggle

  useEffect(() => {
    if (contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight;
      setNeedsToggle(fullHeight > maxHeight);
    }
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

const HeaderOption2 = () => (
  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div 
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-none' : `max-h-[${maxHeight}px]`
        }`}
        style={{ 
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`
        }}
      >

    <CardHeader className="pb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <CardTitle className="text-xl font-medium">DataFlow Pro</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">
          v2.1.0
        </Badge>
      </div>
      <CardDescription className="text-gray-300 text-sm font-light">
        Advanced Data Processing & Analytics Platform
      </CardDescription>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Enterprise-grade solution for data processing, analysis, and visualization.
        </p>
        <div className="flex items-center space-x-6 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span className="font-medium">Size:</span>
            <span>2.4 GB</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span className="font-medium">Modified:</span>
            <span>2 hours ago</span>
          </div>
        </div>
      </div>
    </CardHeader>
            </div>
                  {needsToggle && (
        <div className="px-6 pb-4">
          <button
            onClick={toggleExpanded}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium group"
          >
            <span>{isExpanded ? 'See less' : 'See more'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 group-hover:transform group-hover:-translate-y-0.5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:transform group-hover:translate-y-0.5 transition-transform duration-200" />
            )}
          </button>
        </div>
      )}

  </Card>
);

// Option 3: Clean White with Accent Border
const HeaderOption3 = () => (
  <Card className="border-l-4 border-l-blue-600 shadow-sm bg-white">
    <CardHeader className="pb-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl text-gray-900">DataFlow Pro</CardTitle>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              v2.1.0
            </Badge>
          </div>
          <CardDescription className="text-gray-500">
            Advanced Data Processing & Analytics Platform
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500">Active</span>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          Enterprise-grade solution for data processing, analysis, and visualization 
          with real-time analytics and intelligent insights.
        </p>
        <div className="flex items-center space-x-6 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span className="font-medium">Size:</span>
            <span className="text-gray-700">2.4 GB</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span className="font-medium">Last modified:</span>
            <span className="text-gray-700">2 hours ago</span>
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
);
