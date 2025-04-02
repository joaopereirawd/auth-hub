import { useEffect, useState } from "react";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:8000/auth/me", {
                    credentials: "include",
                });
                const data = await res.json();

                if (data.authenticated) {
                    setUser(data.user);
                    console.log(data.user, 'data.user');
                } else {
                    window.location.href = "http://localhost:5173"; // 🔄 Redireciona o ecommerce
                }
            } catch (error) {
                console.error("Erro na autenticação:", error);
                window.location.href = "http://localhost:5173/"; // 🔄 Redireciona para o login
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, loading };
};
