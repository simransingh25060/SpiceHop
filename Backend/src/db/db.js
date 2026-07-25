const mongoose = require('mongoose');
const dns = require('dns');

const dnsServers = process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
    : ['8.8.8.8', '1.1.1.1'];

if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
}

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    })
}

module.exports = connectDB;