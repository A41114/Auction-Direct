// GoogleLogin.jsx
import React, { useEffect } from "react";
import axios from "axios";

// const client_id = "YOUR_GOOGLE_CLIENT_ID";
// const redirect_uri = "http://localhost:3000/auth/google/callback";
// const scope = [
//   "profile",
//   "email",
//   "https://www.googleapis.com/auth/user.birthday.read",
//   "https://www.googleapis.com/auth/user.gender.read"
// ].join(" ");

// const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=online&prompt=consent`;



const GoogleLogin = () => {
  useEffect(() => {
    // Load script Google
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "1041720831778-tq3kabrbmufo882tb21m7cr0oi14bi24.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-button"),
        { theme: "outline", size: "large" }
      );

      window.google.accounts.id.prompt(); // Hiện popup nếu cần
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);

    // Gửi token về server để xác thực
    try {
      const res = await axios.post("http://localhost:8080/api/auth/google", {
        token: response.credential,
      });
      console.log("Server response:", res.data);
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div>
      <h2>Đăng nhập bằng Google</h2>
      <div id="google-button"></div>
    </div>
  );
};

export default GoogleLogin;
