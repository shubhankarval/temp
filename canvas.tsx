import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const Canvas = () => (
  <div className="w-[800px] h-[600px] border border-gray-300 overflow-hidden relative">
    <TransformWrapper>
      <TransformComponent>
        <div className="w-[2000px] h-[2000px] bg-[radial-gradient(circle,_#ccc_1px,_transparent_1px)] bg-[size:20px_20px]">
          {/* Render your nodes/shapes here */}
        </div>
      </TransformComponent>
    </TransformWrapper>
  </div>
);
