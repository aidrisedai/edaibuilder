"use client";

import { useParams } from "next/navigation";

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">
        Class Details
      </h1>
      <p className="text-muted-foreground mt-1">
        Class ID: {classId}
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Detailed class view coming soon. Use the main teacher dashboard for now.
      </p>
    </div>
  );
}
