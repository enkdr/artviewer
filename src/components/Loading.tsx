type LoadingProps = {
    message?: string;
};

export const Loading = ({ message }: LoadingProps) => {
    return (
        <div className="loading-component">
            <svg
                className="spinner"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="spinner-circle"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                />
            </svg>
            {message && <span className="loading-message">{message}</span>}
        </div>
    );
};
