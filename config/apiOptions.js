const apiOptions = {
    server: 'http://localhost:3000'
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://social-eminence-tracking-app.mybluemix.net';
}

module.exports = {
    apiOptions
}