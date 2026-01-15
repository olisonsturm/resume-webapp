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
                const standardWidth = 794; // A4 px width

                // Always fit to width
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
                paddingBottom: '70%', // Aspect ratio (approx 50% of A4 height)
                // A4 is 141.4%. Half is 70.7%. 
                // This ensures we always show the top half scaled to width.
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
                    transformOrigin: 'top left', // Scale from top left so it fills the width
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

            {/* Gradient overlay removed to keep it clean white/blue */}
        </div>
    );
}
