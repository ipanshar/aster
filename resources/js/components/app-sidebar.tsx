import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Boxes, CircleDollarSign, Folder, LayoutGrid, ShieldCheck } from 'lucide-react';
import AppLogo from './app-logo';
import { useUser } from '@/components/UserContext'; // Контекст для получения данных пользователя

// Навигация основного меню
const mainNavItems: NavItem[] = [
    {
        title: 'Админ панель',
        href: '/adminpanel',
        icon: ShieldCheck,
        role: 'Администратор', // Доступ только для администраторов
    },
    {
        title: 'Бухгалтерия',
        href: '/productsmanagment',
        icon: CircleDollarSign,
        role: 'Бухгалтер', // Доступ  для роль Бухгалтер
    },
    {
        title: 'Панель управления',
        href: '/dashboard',
        icon: LayoutGrid,
        role:'',
    },
];

// Навигация нижнего меню
const footerNavItems: NavItem[] = [
    {
        title: 'Репозиторий',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
        role:'Администратор',
    },
    {
        title: 'Документация',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
        role:'Администратор',
    },
];

export function AppSidebar() {
    const { user  } = useUser(); // Получение ролей пользователя из контекста
    // Фильтрация элементов меню на основе роли
    const filteredMainNavItems = mainNavItems.filter((item) => {
        return !item.role || user?.roles.includes(item.role);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
