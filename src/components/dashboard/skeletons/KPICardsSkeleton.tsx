import { Skeleton } from "@/components/ui/skeleton";

export function KPICardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#0B0B0F] border border-gray-800/80 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-4 w-24 bg-gray-800" />
                        <Skeleton className="h-8 w-8 rounded-md bg-gray-800" />
                    </div>
                    <Skeleton className="h-8 w-16 bg-gray-800 mb-2" />
                    <Skeleton className="h-3 w-32 bg-gray-800" />
                </div>
            ))}
        </div>
    );
}
