import React from 'react';


const ContinueWithGoogle = ({
    href = '/api/auth/google',
    onClick,
    theme = 'dark',
    text = 'Continue with Google',
    shape = 'rounded',
    showDivider = true,
    dividerText = 'or',
    disabled = false,
    className = '',
}) => {
    // Shape styles following Google specification (rectangular with radius or pill)
    const shapeClasses = {
        rounded: 'rounded-xl',
        pill: 'rounded-full',
        square: 'rounded-md',
    }[shape] || 'rounded-xl';

    // Official Google Themes
    const themeStyles = {
        dark: {
            backgroundColor: '#131314',
            borderColor: '#8E918F',
            color: '#E3E3E3',
        },
        light: {
            backgroundColor: '#FFFFFF',
            borderColor: '#747775',
            color: '#1F1F1F',
        },
        white: {
            backgroundColor: '#FFFFFF',
            borderColor: '#E3E3E3',
            color: '#1F1F1F',
        },
    }[theme] || {
        backgroundColor: '#131314',
        borderColor: '#8E918F',
        color: '#E3E3E3',
    };

    const themeHoverClasses = {
        dark: 'hover:bg-[#202124] hover:border-[#9AA0A6] active:bg-[#2A2B2D]',
        light: 'hover:bg-[#F8F9FA] hover:border-[#5F6368] active:bg-[#EEEEEE] shadow-sm hover:shadow',
        white: 'hover:bg-[#F8F9FA] hover:border-[#DADCE0] active:bg-[#F1F3F4] shadow-sm hover:shadow',
    }[theme] || 'hover:bg-[#202124] hover:border-[#9AA0A6] active:bg-[#2A2B2D]';

    // Base font styling conforming to Google Guidelines: Roboto Medium, 14px, 0.25px letter spacing
    const fontStyle = {
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.25px',
        ...themeStyles,
    };

    const buttonClasses = `
    group relative flex items-center justify-center w-full h-12 px-4
    border transition-all duration-200 select-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]
    ${shapeClasses}
    ${themeHoverClasses}
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
    ${className}
  `.trim();

    // Official Google Multi-color 'G' icon
    const GoogleIcon = () => (
        <svg
            className="w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Blue */}
            <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            {/* Green */}
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            {/* Yellow */}
            <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            {/* Red */}
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
        </svg>
    );

    const content = (
        <>
            <GoogleIcon />
            <span className="truncate">{text}</span>
        </>
    );

    return (
        <div className="w-full">
            {showDivider && (
                <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-zinc-800" />
                    <span className="absolute bg-[#14161f] px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500 select-none">
                        {dividerText}
                    </span>
                </div>
            )}

            {onClick ? (
                <button
                    type="button"
                    onClick={onClick}
                    disabled={disabled}
                    className={buttonClasses}
                    style={fontStyle}
                    aria-label={text}
                >
                    {content}
                </button>
            ) : (
                <a
                    href={href}
                    className={buttonClasses}
                    style={fontStyle}
                    aria-label={text}
                >
                    {content}
                </a>
            )}
        </div>
    );
};

export default ContinueWithGoogle;