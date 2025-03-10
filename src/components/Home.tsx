interface HomeProps {
    onClick: () => void;
}

export const Home: React.FC<HomeProps> = ({ onClick }) => {
    return (
        <div className="home-container">
            <h1>Welcome to ArtViewer</h1>
            <p>
                Discover and explore an extensive collection of artists and their works.
            </p>
            <p>
                Our platform allows you to browse artists, view detailed profiles, and
                explore galleries.
            </p>
            <p>
                Whether you're an art enthusiast
                or a casual admirer, ArtViewer brings the world of art to your fingertips.
            </p>
            <p>
                Click on an artist to view their profile, explore their works,
                and learn more about their creative journey.
            </p>
            <div className="buttons">
                <p className="get-started" onClick={onClick}>Get Started</p>
            </div>
        </div >
    );
}
