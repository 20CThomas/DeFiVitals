'use client';

export default function FirestoreTestPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-4xl font-bold">
              Firestore Test Page Temporarily Disabled
            </h1>
            <p>
              This page is temporarily disabled while we migrate Firebase functionality to the data service.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
