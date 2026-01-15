import { useRef, useEffect, useState } from 'react';
import { ResumePreview } from './Preview/ResumePreview';
import { LetterPreview } from './LetterPreview/LetterPreview';
import type { Resume } from '../types/resume';
import type { LetterData } from '../types/letter';

interface DocumentPreviewProps {
    type: 'cv' | 'letter';
    data: Resume | LetterData;
    className?: string;
    height?: number; // Optional fixed height in pixels
}

export function DocumentPreview({ type, data, className = '', height }: DocumentPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.3);

    // Calculate scale to fit container
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                // If height is provided, use it; otherwise fallback to A4 ratio based on width
                const targetHeight = height || (containerWidth * 1.414);

                const standardWidth = 794;
                const standardHeight = 1123;

                // Calculate scale to fit CONTAIN within the box
                const scaleW = containerWidth / standardWidth;
                const scaleH = targetHeight / standardHeight;

                // Use the smaller scale to ensure it fits entirely
                const newScale = Math.min(scaleW, scaleH);

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
    }, [height]);

    return (
        <div
            ref={containerRef}
            className={`relative bg-white overflow-hidden rounded-t-lg ${className}`}
            style={{
                height: height ? `${height}px` : 0,
                paddingBottom: height ? 0 : '141.4%', // Aspect ratio of A4 if no height set
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'flex-start', // Top align
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
                    // If we are centering (flex), left 0 might fight with justify-center if width is fixed.
                    // But Transform origin is top center.
                    // Let's rely on flex centering of the parent for horizontal alignment.
                    // But we need relative positioning for the child if parent is flex?
                    // Actually, absolute positioning is fine if we center the transform origin.
                    width: '794px', // Force expected width of A4
                    height: '1123px', // Force expected height of A4
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center', // Scale from top center to keep centered
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
