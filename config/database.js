if (process.env.NODE_ENV === 'production') {
    module.exports = { 'mongoURI': 'mongodb://mpsingh:9855207302mp@ds161164.mlab.com:61164/vidjot-prod' };
} else {
    module.exports = { 'mongoURI': 'mongodb://localhost/vidjot-dev' };
}