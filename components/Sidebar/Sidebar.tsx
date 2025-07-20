'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/auth/authSlice';
import { HouseIcon, UsersIcon, EnvelopeIcon, SparkleIcon, SignOutIcon } from '@phosphor-icons/react';

interface SidebarProps {
	eventId?: string;
}

const Sidebar = ({ eventId }: SidebarProps) => {
	const t = useTranslations('Sidebar');
	const authT = useTranslations('Auth');
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(logout());
		router.push('/login');
	};

	const navItems = eventId
		? [
				{ id: 'dashboard', href: `/events/${eventId}`, icon: HouseIcon, label: t('dashboard') },
				{ id: 'guests', href: `/events/${eventId}/guests`, icon: UsersIcon, label: t('guests') },
				{ id: 'invitations', href: `/events/${eventId}/invitations`, icon: EnvelopeIcon, label: t('invitation') },
		  ]
		: [];

	const isActive = (href: string) => {
		// For exact match on main dashboard page
		if (href.split('/').length === 3) return pathname === href;
		// For parent match on sub-pages
		return pathname.startsWith(href);
	};

	return (
		<aside className='sidebar'>
			<div>
				<Link href='/events' className='sidebar-header'>
					<SparkleIcon weight='fill' className='icon' />
					<h1>EventOS.ai</h1>
				</Link>
				<nav>
					<ul className='nav-list'>
						{navItems.map((item) => (
							<li className='nav-item' key={item.id}>
								<Link href={item.href} className={isActive(item.href) ? 'active' : ''}>
									<item.icon weight='bold' className='icon' />
									<span>{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<button onClick={handleLogout} className='nav-item logout-btn'>
				<SignOutIcon weight='bold' className='icon' />
				<span>{authT('logout')}</span>
			</button>
		</aside>
	);
};

export default Sidebar;
