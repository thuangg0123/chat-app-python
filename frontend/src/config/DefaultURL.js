class DefaultURL {
    // static defaultURL = "http://10.0.19.99:5000";
    // static defaultURL = "http://192.168.0.199:5000";
    static defaultURL = "http://127.0.0.1:5000";
    // static defaultURL = "https://chat-app-be-lqa2.onrender.com";

    static getURL() {
        return DefaultURL.defaultURL;
    }
}

export default DefaultURL;