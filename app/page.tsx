export default function RootPage() {
	// This page is a placeholder.
	// The middleware redirects to the default locale's root page,
	// so this component should not be rendered.
	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='spinner' style={{ width: 50, height: 50 }}></div>
		</div>
	);
}
