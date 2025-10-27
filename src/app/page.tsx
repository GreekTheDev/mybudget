'use client';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 pb-4">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Pulpit</h1>
        
        {/* Content area - ready for new widgets */}
        <div className="space-y-8">
          <p className="text-muted-foreground text-center py-12">
            Dashboard is ready for new components
          </p>
        </div>
      </div>
    </div>
  );
}
