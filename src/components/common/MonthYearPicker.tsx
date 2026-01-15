import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './MonthYearPicker.css';

interface MonthYearPickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showPresent?: boolean;
}

const MONTHS = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
];

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function MonthYearPicker({ value, onChange, placeholder = 'MM/YYYY', showPresent = false }: MonthYearPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse current value
    const isPresent = value === 'Present';
    const [currentMonth, currentYear] = !isPresent && value.includes('/') ? value.split('/') : ['', ''];

    const [selectedYear, setSelectedYear] = useState(currentYear || new Date().getFullYear().toString());

    // Generate years (current year +/- 20)
    const currentYearInt = new Date().getFullYear();
    const years = Array.from({ length: 41 }, (_, i) => (currentYearInt - 30 + i).toString()).reverse();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (month: string) => {
        onChange(`${month}/${selectedYear}`);
        setIsOpen(false);
    };

    const handlePresent = () => {
        onChange('Present');
        setIsOpen(false);
    };

    return (
        <div className="month-year-picker-container" ref={containerRef}>
            <div className="picker-input-wrapper" onClick={() => setIsOpen(!isOpen)}>
                <input
                    type="text"
                    value={value}
                    readOnly
                    placeholder={placeholder}
                    className="picker-input"
                />
                <Calendar size={16} className="picker-icon" />
            </div>

            {isOpen && (
                <div className="picker-dropdown">
                    <div className="picker-header">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="year-select"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        {showPresent && (
                            <button className="btn-present" onClick={handlePresent}>
                                Present
                            </button>
                        )}
                    </div>
                    <div className="months-grid">
                        {MONTHS.map((m, i) => (
                            <button
                                key={m}
                                className={`month-button ${currentMonth === m && currentYear === selectedYear ? 'active' : ''}`}
                                onClick={() => handleSelect(m)}
                            >
                                {MONTH_NAMES[i]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
