import { ContactItem } from "./contact-item";
import { contactData } from "@/lib/contact-config";

export function ContactInfo() {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Contact Information
      </h3>
      
      <div className="space-y-6">
        {contactData.map((item, index) => (
          <ContactItem
            key={index}
            icon={item.icon}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </div>
  );
} 