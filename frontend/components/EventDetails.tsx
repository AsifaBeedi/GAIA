"use client";

interface GlobalEvent {
    id: string;
    topic: string;
    sentiment: string;
    lang: string;
    text: string;
    score: number;
}

interface EventDetailsProps {
    event: GlobalEvent | null;
    onClose: () => void;
}

export default function EventDetails({ event, onClose }: EventDetailsProps) {
    if (!event) return null;

    const sentimentColor =
        event.sentiment === 'fear' ? 'text-red-500' :
            event.sentiment === 'joy' ? 'text-green-500' :
                event.sentiment === 'anger' ? 'text-orange-500' :
                    'text-blue-500';

    return (
        <div className="absolute top-0 right-0 h-full w-80 z-20 bg-black/90 border-l border-teal-500/30 p-6 backdrop-blur-xl transform transition-transform duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h2 className="text-teal-400 font-mono text-sm tracking-widest">DATA INTERCEPT</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-white font-mono text-xs">[CLOSE]</button>
            </div>

            <div className="space-y-6 font-mono">
                <div>
                    <label className="text-[10px] text-gray-500 uppercase">Topic</label>
                    <div className="text-white text-sm">{event.topic}</div>
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 uppercase">Detected Language</label>
                    <div className="text-gray-300 text-xs">{event.lang.toUpperCase()}</div>
                </div>

                <div className="p-3 border border-gray-800 bg-gray-900/50 rounded">
                    <label className="text-[10px] text-gray-500 uppercase mb-1 block">Full Message</label>
                    <p className="text-sm italic text-gray-200">"{event.text}"</p>
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 uppercase">AI Analysis</label>
                    <div className={`text-xl font-bold uppercase ${sentimentColor}`}>
                        {event.sentiment}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Confidence: {(event.score * 100).toFixed(1)}%
                    </div>

                    {/* Fake Progress Bar */}
                    <div className="w-full bg-gray-900 h-1 mt-2 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${event.sentiment === 'fear' ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${event.score * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
