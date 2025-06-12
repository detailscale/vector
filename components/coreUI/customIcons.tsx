import React from "react";
import { icons, LucideProps, Soup } from "lucide-react";

interface DynamicLucideIconProps extends Omit<LucideProps, "name"> {
  iconName: keyof typeof icons;
}

const DynamicLucideIcon: React.FC<DynamicLucideIconProps> = ({
  iconName,
  ...props
}) => {
  const LucideIcon = icons[iconName] || Soup; // Use Soup as fallback

  return (
    <div className="w-10 h-10 bg-neutral-800 rounded-md flex items-center justify-center border border-neutral-700">
      <LucideIcon className="text-neutral-300" {...props} />
    </div>
  );
};

export default DynamicLucideIcon;
