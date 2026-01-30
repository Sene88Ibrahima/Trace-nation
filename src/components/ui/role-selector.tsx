import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/contexts/AuthContext";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
  disabled?: boolean;
  className?: string;
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  superadmin: 'Super Admin',
  citoyen: 'Citoyen'
};

export function RoleSelector({ value, onChange, disabled, className }: RoleSelectorProps) {
  return (
    <Select 
      value={value} 
      onValueChange={(val) => onChange(val as UserRole)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sélectionner un rôle" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(roleLabels).map(([role, label]) => (
          <SelectItem key={role} value={role}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
