export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
}) {
  const base = `
    inline-flex items-center justify-center
    font-medium tracking-widest uppercase
    transition-all duration-150 border
    disabled:opacity-40 disabled:cursor-not-allowed
  `

  const variants = {
    primary: 'bg-[#111] text-white border-[#111] hover:bg-[#333]',
    outline: 'bg-white text-[#111] border-[#111] hover:bg-[#f4f4f4]',
    ghost:   'bg-transparent text-[#111] border-transparent hover:bg-[#f4f4f4]',
    danger:  'bg-[#ef4444] text-white border-[#ef4444] hover:bg-[#dc2626]',
  }

  const sizes = {
    sm: 'text-[10px] px-3 py-1.5',
    md: 'text-[11px] px-5 py-2.5',
    lg: 'text-[12px] px-7 py-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ letterSpacing: '0.1em' }}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  )
}