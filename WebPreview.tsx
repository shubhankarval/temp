// components/WebPreview.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

type WebPreviewProps = {
  title: string;
  url: string;
  height?: string; // e.g., "h-[600px]"
};

export function WebPreview({ title, url, height = "h-[600px]" }: WebPreviewProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Card className="w-full overflow-hidden rounded-2xl shadow-md border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative p-0">
        {!loaded && <Skeleton className={`absolute top-0 left-0 w-full ${height} z-10`} />}
        <iframe
          src={url}
          className={`w-full ${height} border-0 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </CardContent>
    </Card>
  );
}
