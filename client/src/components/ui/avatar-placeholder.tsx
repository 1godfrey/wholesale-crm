type AvatarPlaceholderProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const AvatarPlaceholder = ({ name, size = 'md', className = '' }: AvatarPlaceholderProps) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-neutral-700 flex items-center justify-center font-medium text-white ${className}`}>
      {initials}
    </div>
  );
};
