import React from 'react';
import './StatCard.css';

interface StatCardProps {
	icon: React.ReactNode;
	value: string | number;
	label: string;
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
	<div className='card stat-card'>
		<div className='stat-card-icon'>{icon}</div>
		<div className='stat-card-value'>{value}</div>
		<div className='stat-card-label'>{label}</div>
	</div>
);

export default StatCard;
