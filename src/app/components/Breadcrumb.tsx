"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChevronRight } from "react-icons/fa";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Otomatik breadcrumb oluşturma
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", href: "/" }];
    
    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Segment isimlerini daha okunabilir hale getir
      let name = segment;
      if (segment === "blog") name = "Blog";
      else if (segment === "about") name = "About";
      else if (segment === "admin") name = "Admin";
      else {
        // Slug'ları başlık formatına çevir
        name = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      }
      
      breadcrumbs.push({
        name,
        href: currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="mb-6"
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isCurrent = currentPage ? item.name === currentPage : isLast;
          
          return (
            <li
              key={item.href}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <FaChevronRight className="mx-2 w-3 h-3 text-gray-400" aria-hidden="true" />
              )}
              
              {index === 0 && (
                <FaHome className="mr-2 w-4 h-4" aria-hidden="true" />
              )}
              
              {isCurrent ? (
                <span 
                  className="font-medium text-gray-900"
                  aria-current="page"
                  itemProp="name"
                >
                  {currentPage || item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              
              {/* Schema.org position */}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}