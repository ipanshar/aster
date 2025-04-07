import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Продукция',
        href: '/productsmanagment',
        icon: null,
        role:'',
    },
    {
        title: 'Курс',
        href: '/rate',
        icon: null,
        role:'',
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // При серверном рендеринге мы отображаем макет только на клиенте...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Бухгалтерия" description="Управляйте  бухгалтерией" />

            <div className="space-y-8">
                {/* Верхняя панель навигации */}
                <nav className="flex space-x-6">
                    {sidebarNavItems.map((item) => (
                        <Button
                            key={item.href}
                            size="sm"
                            variant="ghost"
                            asChild
                            className={cn('w-auto', {
                                'bg-muted': currentPath === item.href,
                            })}
                        >
                            <Link href={item.href} prefetch>
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>

                <Separator className="my-6" />

                <div className="flex-1">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
