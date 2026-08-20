const Error = () => {
    return (
        <div>
            But this works!
        </div>
    );
};

export default Error;

Error.getInitialProps = async () => {
    console.log('Can handle server redirects here.')

    return {}
}
