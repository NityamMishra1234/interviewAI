// Reusable Submit Button
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
}

export function SubmitButton({ label, loading }: SubmitButtonProps) {
  return (
    <Button disabled={loading} type="submit" className="w-full">
      {loading ? 'Loading...' : label}
    </Button>
  );
}

// Form Wrapper with Title + Subtitle
interface AuthFormWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthFormWrapper({ title, subtitle, children }: AuthFormWrapperProps) {
  return (
    <div className="max-w-md w-full mx-auto space-y-6 p-6 rounded-2xl bg-white shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
