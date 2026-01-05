// Componente auxiliar para los requisitos de password
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
        <div
            className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-[var(--green)]' : 'bg-[var(--gray-200)]'
                }`}
        />
        <span
            className={`text-xs ${met ? 'text-[var(--green)]' : 'text-[var(--gray-200)]'
                }`}
        >
            {text}
        </span>
    </div>
);

interface PasswordRequirementsProps {
    hasMinLength: boolean;
    hasLowerCase: boolean;
    hasUpperCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

export const PasswordRequirements = ({
    hasMinLength,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
}: PasswordRequirementsProps) => {
    return (
        <div className="bg-[var(--gray-400)] rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-[var(--gray-200)] mb-2">
                Tu contraseña debe contener:
            </p>
            <div className="space-y-1.5">
                <PasswordRequirement met={hasMinLength} text="Al menos 8 caracteres" />
                <PasswordRequirement met={hasLowerCase} text="Una letra minúscula" />
                <PasswordRequirement met={hasUpperCase} text="Una letra mayúscula" />
                <PasswordRequirement met={hasNumber} text="Un número" />
                <PasswordRequirement met={hasSpecialChar} text="Un carácter especial (!@#$%^&*)" />
            </div>
        </div>
    );
};

