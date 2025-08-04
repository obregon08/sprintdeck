import { ReactNode } from "react";

interface ContactItemProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
}

export function ContactItem({ icon, title, content }: ContactItemProps) {
  return (
    <div className="flex items-start">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300">{content}</p>
      </div>
    </div>
  );
} 