'use client';

import { useLocale } from 'next-intl';
// @ts-ignore
import { useRouter, usePathname } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSelector() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <select
            className="bg-transparent border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            defaultValue={locale}
            onChange={handleChange}
            disabled={isPending}
        >
            <option value="es">🇪🇸 ES</option>
            <option value="en-GI">🇬🇮 EN</option>
        </select>
    );
}
