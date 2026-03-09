import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = '0Fill AI Chat';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

async function getFormInfo(token: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
        const res = await fetch(`${apiUrl}/public/chat/${token}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        return null;
    }
}

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    const form = await getFormInfo(token);

    if (!form) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0B0B0F',
                        color: 'white',
                    }}
                >
                    <h1 style={{ fontSize: 60, fontWeight: 'bold' }}>0Fill</h1>
                    <p style={{ fontSize: 32, color: '#a1a1aa' }}>Intelligent AI Forms</p>
                </div>
            ),
            { ...size }
        );
    }

    const aiName = form.aiName || '0Fill Assistant';
    const title = form.title || 'Untitled Form';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    backgroundColor: '#0B0B0F',
                    border: '8px solid #1C1C22',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 16,
                            backgroundColor: '#0da372',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 24,
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <span style={{ color: '#0da372', fontSize: 40, fontWeight: 'bold', letterSpacing: '-0.02em' }}>
                        0Fill
                    </span>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            color: 'white',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            marginBottom: 24,
                            maxWidth: '900px',
                        }}
                    >
                        {title.length > 60 ? `${title.slice(0, 60)}...` : title}
                    </h1>
                    <p
                        style={{
                            fontSize: 36,
                            color: '#a1a1aa',
                            margin: 0,
                            maxWidth: '900px',
                            lineHeight: 1.4,
                        }}
                    >
                        Chat with <strong style={{ color: '#0da372', marginLeft: 8, marginRight: 8, fontWeight: 'bold' }}>{aiName}</strong> to complete this form.
                    </p>
                </div>

                {/* Footer details */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1C1C22', padding: '16px 32px', borderRadius: 100 }}>
                        <span style={{ fontSize: 24, color: '#a1a1aa', marginRight: 16 }}>Est. Time:</span>
                        <span style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>~{form.estimatedMinutes} mins</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1C1C22', padding: '16px 32px', borderRadius: 100, marginLeft: 24 }}>
                        <span style={{ fontSize: 24, color: '#a1a1aa', marginRight: 16 }}>Questions:</span>
                        <span style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>{form.questionCount}</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
