import { cn } from "@/lib/utils";
import { UserRole } from "@/contexts/AuthContext";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleConfig = {
    admin: {
      label: 'Administrateur',
      className: 'bg-purple-100 text-purple-800',
    },
    superadmin: {
      label: 'Super Admin',
      className: 'bg-blue-100 text-blue-800',
    },
    citoyen: {
      label: 'Citoyen',
      className: 'bg-green-100 text-green-800',
    }
  };

  const config = roleConfig[role] || { label: 'Inconnu', className: 'bg-gray-100 text-gray-800' };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
