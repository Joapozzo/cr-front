import { FileX } from 'lucide-react';

interface EmptyStateProps {
    message: string;
    hint?: string;
}

export const EmptyState = ({ message, hint }: EmptyStateProps) => {
    return (
        <div className="text-center py-8">
            <FileX className="w-12 h-12 text-[var(--gray-200)] mx-auto mb-3" />
            <p className="text-[var(--gray-100)]">{message}</p>
            {hint && (
                <p className="text-[var(--gray-200)] text-sm mt-2">{hint}</p>
            )}
        </div>
    );
};

