import { useState, useEffect, useRef } from 'react';
import { Loader2, Check, Cloud } from 'lucide-react';
import './SaveIndicator.css';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveIndicatorProps {
    /** Data to watch for changes */
    watchData: unknown;
    /** Debounce delay in ms */
    debounceMs?: number;
}

export function SaveIndicator({ watchData, debounceMs = 1000 }: SaveIndicatorProps) {
    const [status, setStatus] = useState<SaveStatus>('idle');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstMount = useRef(true);
    const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Skip the first mount to avoid showing "saving" on initial load
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        // Clear existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (savedTimeoutRef.current) {
            clearTimeout(savedTimeoutRef.current);
        }

        // Set to saving immediately when data changes
        setStatus('saving');

        // After debounce, show saved (Zustand persist saves automatically)
        timeoutRef.current = setTimeout(() => {
            setStatus('saved');

            // After 2 seconds, fade back to idle
            savedTimeoutRef.current = setTimeout(() => {
                setStatus('idle');
            }, 2000);
        }, debounceMs);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
        };
    }, [watchData, debounceMs]);

    return (
        <div className={`save-indicator ${status}`}>
            {status === 'idle' && (
                <>
                    <Cloud size={14} />
                    <span>Auto-Save</span>
                </>
            )}
            {status === 'saving' && (
                <>
                    <Loader2 size={14} className="spin" />
                    <span>Speichern...</span>
                </>
            )}
            {status === 'saved' && (
                <>
                    <Check size={14} />
                    <span>Gespeichert</span>
                </>
            )}
        </div>
    );
}
