type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
  };
  
  function Button({ children, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F6655]"
      >
        {children}
      </button>
    );
  }
  
  export default Button;