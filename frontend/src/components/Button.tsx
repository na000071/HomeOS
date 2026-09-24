type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
  };
  
  function Button({ children, onClick }: ButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="homeos-primary-button rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
      >
        {children}
      </button>
    );
  }
  
  export default Button;