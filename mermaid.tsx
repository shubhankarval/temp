// components/MermaidViewer.tsx
import React, { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import panzoom from "panzoom"
import { Button } from "@/components/ui/button"
import { Fullscreen, Minimize } from "lucide-react"
import clsx from "clsx"

interface MermaidViewerProps {
  chart: string // Mermaid diagram code
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false })

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render("mermaid-diagram", chart)
        if (svgRef.current) {
          svgRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error("Mermaid render error:", err)
      }
    }

    renderMermaid()
  }, [chart])

  useEffect(() => {
    if (svgRef.current) {
      const instance = panzoom(svgRef.current.querySelector("svg") as SVGSVGElement, {
        smoothScroll: false,
        maxZoom: 5,
        minZoom: 0.5,
      })

      return () => {
        instance.dispose()
      }
    }
  }, [chart])

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative bg-white border rounded shadow overflow-hidden",
        fullscreen ? "fixed inset-0 z-50 bg-white" : "w-full max-w-3xl h-[500px]"
      )}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFullscreen((prev) => !prev)}
        >
          {fullscreen ? <Minimize size={16} /> : <Fullscreen size={16} />}
        </Button>
      </div>

      <div className="w-full h-full overflow-hidden">
        <div
          ref={svgRef}
          className="w-full h-full flex items-center justify-center cursor-move"
        />
      </div>
    </div>
  )
}


// Example usage
import { MermaidViewer } from "@/components/MermaidViewer"

const diagram = `
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`

export default function Page() {
  return (
    <div className="p-4">
      <MermaidViewer chart={diagram} />
    </div>
  )
}
