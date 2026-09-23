type CardProps = {
    children: React.ReactNode;
    className?: string;
  };
  
  function Card({ children, className = "" }: CardProps) {
    return (
      <div
        className={`rounded-xl border border-stone-200 bg-white ${className}`}
      >
        {children}
      </div>
    );
  }
  
  export default Card;