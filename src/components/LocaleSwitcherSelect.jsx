'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcherSelect({ children, defaultValue, label }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();

    function onSelectChange(event) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(
                // @ts-expect-error
                { pathname, params },
                { locale: nextLocale }
            );
        });
    }

    return (
        <label
            className={clsx(
                'relative text-gray-400',
                isPending && 'transition-opacity [&:disabled]:opacity-30'
            )}
        >
            <p className="sr-only">{label}</p>
            <select
                className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6"
                defaultValue={defaultValue}
                disabled={isPending}
                onChange={onSelectChange}
            >
                {children}
            </select>
            <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
        </label>
    );
}
