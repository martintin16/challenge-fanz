export interface AvatarProps {
  name: string;
}

export interface SidebarProps {
  title?: string;
  name?: string;
  footerText?: string;
}

export interface InfoCardProps {
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export interface ButtonProps {
  label: string;
  disabled?: boolean;
  type?: "primary" | "secondary" | "tertiary";
}

export interface ChatInputProps {
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
}
