import { icons } from 'lucide-react-native';

const Icon = ({ name, color, size, ...props }: any) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} {...props} />;
};

export default Icon;
