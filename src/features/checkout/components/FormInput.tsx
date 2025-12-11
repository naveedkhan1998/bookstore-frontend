import type { FC, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
  error?: string;
}

const FormInput: FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  ...props
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <input
      {...props}
      className={`
        w-full px-4 py-2.5 
        bg-white dark:bg-gray-800 
        border rounded-lg 
        transition-colors duration-200
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 dark:border-gray-700 focus:border-secondary focus:ring-secondary/20"
        }
        focus:outline-none focus:ring-2
      `}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default FormInput;
