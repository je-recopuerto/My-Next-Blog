import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  Home, 
  PlusCircle, 
  FileText, 
  Users, 
  Settings, 
  ArrowLeft,
  LayoutDashboard,
  Menu,
  X,
  ArrowRight
} from 'lucide-react'
import { cn } from '../../components/ui/utils'
import { useSidebar } from './SidebarContext'

const Sidebar = () => {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()
  
  const menuItems = [
    {
      href: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      href: '/admin/addBlog',
      icon: PlusCircle,
      label: 'Add New Post',
    },
    {
      href: '/admin/blogList',
      icon: FileText,
      label: 'All Posts',
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'Users',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'Settings',
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={toggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        'fixed lg:relative inset-y-0 left-0 z-50 min-h-screen bg-background border-r border-border transition-all duration-300 ease-in-out',
        isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'
      )}>
        <div className='p-6'>
          {/* Toggle Button */}
          <button
            onClick={toggle}
            className='absolute cursor-pointer -right-3 top-6 bg-primary border border-border rounded-full p-1.5 text-primary-foreground hover:bg-primary/90 transition-all duration-200 z-10 shadow-md'
          >
            {isOpen ? <ArrowLeft className='w-4 h-4' /> : <ArrowRight className='w-4 h-4' />}
          </button>
          {/* Header */}
          <div className={cn('mb-8 transition-all duration-300', !isOpen && 'mb-4')}>
            <div className={cn('flex items-center mb-2', isOpen ? 'space-x-2' : 'justify-center')}>
              {isOpen && (
                <>
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0'>
                <LayoutDashboard className='w-4 h-4 text-primary-foreground' />
              </div>
                <h2 className='text-xl font-bold text-foreground'>Dashboard</h2>
                </>
              )}
            </div>
            {isOpen && (
              <Badge variant="secondary" className='text-xs'>
                Admin
              </Badge>
            )}
          </div>

          {/* Navigation Menu */}
              <nav className='space-y-3 mt-32'>
                {menuItems.map((item) => {
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href)
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!isOpen ? item.label : undefined}
                      className={cn(
                        'group flex items-center text-sm font-medium rounded-md transition-all duration-200',
                        isOpen ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center',
                        isActive
                          ? 'bg-primary px-4 py-2.5 text-primary-foreground shadow-lg'
                          : 'text-muted-foreground px-4 py-2.5 hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <item.icon 
                        className={cn(
                          'h-4 w-4 transition-transform shrink-0',
                          isOpen ? 'mr-3' : 'mr-0',
                          isActive ? 'scale-110' : 'group-hover:scale-105'
                        )} 
                      />
                      {isOpen && (
                        <span className='truncate'>{item.label}</span>
                      )}
                    </Link>
                  )
                })}
              </nav>

          {/* Back to Site Link */}
          <div className='mt-8 pt-6 border-t border-border'>
            <Link
              href="/"
              title={!isOpen ? 'Back to Site' : undefined}
              className={cn(
                'group flex items-center text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200',
                isOpen ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center'
              )}
            >
              <ArrowLeft className={cn(
                'h-4 w-4 transition-transform group-hover:-translate-x-1 shrink-0',
                isOpen ? 'mr-3' : 'mr-0'
              )} />
              {isOpen && 'Back to Site'}
            </Link>
          </div>

          {/* Footer Info */}
          {isOpen && (
            <div className='mt-8 pt-4 border-t border-border'>
              <div className='text-xs text-muted-foreground text-center'>
                NextBlog v1.0
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar