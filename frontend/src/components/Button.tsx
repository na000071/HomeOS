type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
  };
  
  function Button({ children, onClick }: ButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2"
      >
        {children}
      </button>
    );
  }
  
  export default Button;