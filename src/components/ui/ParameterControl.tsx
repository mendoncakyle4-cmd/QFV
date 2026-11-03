import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ParameterControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  defaultValue?: number;
  description?: string;
  onChange: (val: number) => void;
  onReset?: () => void;
  disabled?: boolean;
}

export const ParameterControl: React.FC<ParameterControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  defaultValue,
  description,
  onChange,
  onReset,
  disabled = false,
}) => {
  const isModified = defaultValue !== undefined && Math.abs(value - defaultValue) > 0.001;

  return (
    <div className="flex flex-col gap-1.5 p-2.5 bg-navy-900/60 hover:bg-navy-900/90 border border-navy-border rounded-control transition-colors">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300 select-none">
          {label}
        </label>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-cyan-light font-semibold tabular-nums">
            {value.toFixed(step < 0.1 ? 2 : 1)}
          </span>
          {unit && <span className="text-slate-400 text-[11px]">{unit}</span>}
          {onReset && isModified && (
            <button
              onClick={onReset}
              title="Reset parameter to default"
              aria-label={`Reset ${label} to ${defaultValue}`}
              className="p-0.5 text-slate-400 hover:text-cyan-300 transition-colors ml-1"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>{min}</span>
        {description && <span className="text-slate-400 truncate mx-1">{description}</span>}
        <span>{max}</span>
      </div>
    </div>
  );
};

