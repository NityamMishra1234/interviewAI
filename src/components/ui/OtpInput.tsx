import { Input } from "@/components/ui/input";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, idx) => (
        <Input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => {
            const val = e.target.value;
            const newValue = value.split("");
            newValue[idx] = val;
            onChange(newValue.join(""));
          }}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  );
}