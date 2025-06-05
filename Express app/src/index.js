const express = require('express');

const app = express();
const rateLimitMap = new Map();

const ratelimiter = (req, res, next) => {
	const ip = req.ip;
	const currentTime = Date.now();
	const windowTime = 60 * 1000; // 1 minute
	const limit = 2;

	if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
	const timestamps = rateLimitMap.get(ip).filter(t => currentTime - t < windowTime);
	
	if (timestamps.length >= limit) return res.status(429).send("Rate limit exceeded");

	timestamps.push(currentTime);
	rateLimitMap.set(ip, timestamps);
	next();
}

app.get('/', ratelimiter, (req, res) => {
	res.send("Server is running in /")
})

app.listen(7000, () => {
	console.log("Server is running on port 7000")
})