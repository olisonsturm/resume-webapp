import { useRef, useEffect, useState } from 'react';
import { ResumePreview } from './Preview/ResumePreview';
import { LetterPreview } from './LetterPreview/LetterPreview';
import type { Resume } from '../types/resume';
import type { LetterData } from '../types/letter';

interface DocumentPreviewProps {
    type: 'cv' | 'letter';
    data: Resume | LetterData;
    className?: string;
}

export function DocumentPreview({ type, data, className = '' }: DocumentPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.3);

    // Calculate scale to fit container width
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // A4 width in pixels (standard web usually ~794px or 210mm)
                // ResumePreview usually renders at roughly 800px width typically (A4 at 96dpi is 794px)
                // Let's assume the preview renders at ~794px width.
                const standardWidth = 794;
                const newScale = containerWidth / standardWidth;
                setScale(newScale);
            }
        };

        // Initial calc
        updateScale();

        // Recalc on resize
        const resizeObserver = new ResizeObserver(updateScale);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative bg-white overflow-hidden rounded-t-lg ${className}`}
            style={{
                height: 0,
                paddingBottom: '141.4%' // Aspect ratio of A4 (1 / sqrt(2) approx 1.414 height/width)
            }}
        >
            {/* 
                We use absolute positioning to place the scaled content.
                transform-origin top left allows us to scale it down and keep it at top.
             */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '794px', // Force expected width of A4
                    height: '1123px', // Force expected height of A4
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none', // Prevent interaction with preview
                    userSelect: 'none',
                }}
            >
                {type === 'cv' ? (
                    <ResumePreview data={data as Resume} />
                ) : (
                    <LetterPreview data={data as LetterData} />
                )}
            </div>

            {/* Gradient overlay to make it look nicer at the bottom (fade out) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
        </div>
    );
}
