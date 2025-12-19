import axios from 'axios'

// Get baseURL from environment variable or use default
let baseURL = import.meta.env.VITE_BASEURL || "http://localhost:5000"

// Fix common typos in the URL
if (baseURL.includes('htpp://')) {
    baseURL = baseURL.replace('htpp://', 'http://')
}
if (baseURL.includes('htps://')) {
    baseURL = baseURL.replace('htps://', 'https://')
}

// Ensure URL starts with http:// or https://
if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
    baseURL = 'http://' + baseURL
}

const api = axios.create({
    baseURL: baseURL
})


export default api