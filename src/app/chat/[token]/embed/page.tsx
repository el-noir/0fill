import { ChatClient } from "../ChatClient";

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function EmbedChatPage({ params }: PageProps) {
    const { token } = await params;

    // We use the same ChatClient for now, but we can wrap it or pass a prop
    // to hide the background if needed. For the first version, let's just 
    // make sure the route exists.
    return (
        <div className="overflow-hidden h-[100dvh]">
            <ChatClient token={token} />
        </div>
    );
}
