export const useStyles = () => {
  const buttonClasses = {
    base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-[#0d0d0d] dark:text-gray-100 dark:hover:bg-[#101010]",
    ghost: "hover:bg-gray-100 dark:hover:bg-[#0d0d0d]",
  };

  const inputClasses =
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-[#0d0d0d] dark:text-gray-100 dark:placeholder:text-gray-400";

  const cardClasses =
    "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#0d0d0d]";

  return {
    button: buttonClasses,
    input: inputClasses,
    card: cardClasses,
  };
};
