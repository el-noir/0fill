import { Skeleton } from "@/components/ui/skeleton";

export function FormsListSkeleton() {
    return (
        <div className="bg-[#0B0B0F] rounded-xl border border-gray-800/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-5 border-b border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded bg-gray-800" />
                    <Skeleton className="h-5 w-32 bg-gray-800" />
                    <Skeleton className="h-5 w-6 rounded-full bg-gray-800 ml-2" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-48 rounded-md bg-gray-800" />
                    <Skeleton className="h-9 w-24 rounded-md bg-gray-800" />
                </div>
            </div>

            {/* Table Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-800/80 bg-white/[0.01]">
                <Skeleton className="col-span-5 h-3 w-16 bg-gray-800" />
                <Skeleton className="col-span-2 h-3 w-16 bg-gray-800" />
                <Skeleton className="col-span-2 h-3 w-16 bg-gray-800" />
                <Skeleton className="col-span-2 h-3 w-16 bg-gray-800" />
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-hidden p-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center p-4 border-b border-gray-800/40 last:border-0 rounded-lg">
                        <div className="col-span-5 flex items-center gap-3 w-full">
                            <Skeleton className="h-10 w-10 border border-gray-800 rounded bg-[#111116] shrink-0" />
                            <div className="flex flex-col gap-1.5 w-full">
                                <Skeleton className="h-4 w-3/4 bg-gray-800" />
                                <Skeleton className="h-3 w-1/2 bg-gray-800" />
                            </div>
                        </div>
                        <div className="col-span-2 hidden md:block">
                            <Skeleton className="h-5 w-16 rounded-full bg-gray-800" />
                        </div>
                        <div className="col-span-2 hidden md:block">
                            <Skeleton className="h-4 w-12 bg-gray-800" />
                        </div>
                        <div className="col-span-2 hidden md:block">
                            <Skeleton className="h-4 w-20 bg-gray-800" />
                        </div>
                        <div className="col-span-1 hidden md:flex justify-end">
                            <Skeleton className="h-8 w-8 rounded-md bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
