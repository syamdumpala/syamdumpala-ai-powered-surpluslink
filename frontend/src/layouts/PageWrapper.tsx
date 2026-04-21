export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
      min-h-screen
      bg-background-light dark:bg-background-dark
      text-gray-900 dark:text-white
      transition-theme duration-500
      "
    >
      {children}
    </div>
  );
}
