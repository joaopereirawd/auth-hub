import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


export const LoginForm = () => {

    const handleLoginSuccess = async (response) => {

        const res = await fetch("http://localhost:8000/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();

        if (data.success) {
            // Redirecionar para a aplicação original (E-commerce ou Blog)
            window.location.href = localStorage.getItem("redirect_to") || "http://localhost:5173";
        }
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div>
                <h1>SSO Login System</h1>
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Erro no login")} />
            </div>
        </GoogleOAuthProvider>
    );
}
