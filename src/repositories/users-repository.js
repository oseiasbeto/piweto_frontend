import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function useUsers() {
    const loading = ref(false);
    const error = ref(false);
    const store = useStore()

    let refreshTimeout = null;

    const register = async (data) => {
        try {
            loading.value = true
            await api.post("/users/register", data)

            store.dispatch("setUser", data)
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }



    // tem como finalidade refrescar o token de acesso
    const refreshToken = async (session_id) => {
        try {
            loading.value = true
            await api.post("/users/refresh-access-token", {
                session_id
            }).then(res => {
                const user = res.data.user
                const accessToken = res.data.access_token
                store.dispatch("setUser", user)
                store.dispatch("setAccessToken", accessToken)
                scheduleTokenRefresh(accessToken)
            }).finally(() => {
                loading.value = false
            })
        } catch (err) {
            console.log(err)
            clearRefreshToken()
            console.log(err.message)
            throw err
        }
    }

    // tem como finalidade autenticar o usuario no sistema.
    const auth = async (data) => {
        try {
            loading.value = true

            const response = await api.post("/users/auth", data)
            const user = response.data.user
            const accessToken = response.data.access_token
            const sessionId = response.data.session_id

            store.dispatch("setUser", user)
            store.dispatch("setAccessToken", accessToken)

            scheduleTokenRefresh(accessToken)
            setRefreshTokenFromCookies(sessionId)

            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    // tem como finalidade autenticar o usuario no sistema.
    const checkEmail = async (email) => {
        try {
            loading.value = true

            const response = await api.put("/users/check-email", {
                email
            })
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const activeEmail = async (token) => {
        try {
            loading.value = true

            const response = await api.put("/users/active-email", {
                token
            })
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const checkOTPPhone = async (otp) => {
        try {
            loading.value = true
            const response = await api.put(`/users/check-otp-phone/${otp}`)

            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const checkOTPPassword = async (otp) => {
        try {
            loading.value = true
            const response = await api.get(`/users/check-otp-reset-password/${otp}`)

            return response.data.otp
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const logout = async (session_id) => {
        try {
            // Validação básica do session_id
            if (!session_id || typeof session_id !== "string" || session_id.trim() === "") {
                throw new Error("ID de sessão inválido.");
            }

            loading.value = true;

            // Chamar a API com timeout (exemplo com Axios)
            const response = await api.post(
                "/users/destroy-session",
                { session_id },
                { timeout: 10000 } // 10 segundos de timeout
            );

            // Verificar se o logout foi bem-sucedido no backend
            if (response.status === 200) {
                store.dispatch("setAccessToken", null);
                clearRefreshToken(); // Assumindo que limpa localmente
            } else {
                throw new Error("Falha ao encerrar a sessão no servidor.");
            }
        } catch (err) {
            console.error("Erro ao fazer logout:", err.message);
            // Opcional: exibir notificação ao usuário
            alert("Erro ao encerrar a sessão. Tente novamente.");
            // Não relançar o erro, a menos que necessário
        } finally {
            loading.value = false;
        }
    };

    const forgotPassword = async (data) => {
        try {
            loading.value = true
            const response = await api.post("/users/forgot-password", data)
            const user = response.data.user
            return user
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const updateUser = async (data) => {
        try {
            loading.value = true
            await api.put("/users", data)
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const resetPassword = async (data) => {
        try {
            loading.value = true
            return await api.put(`/users/reset-password/${data.otp}`, {
                new_password: data.new_password
            })
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    // tem como finalidade remover a chave do refresh token dos cookies
    function clearRefreshToken() {
        Cookies.remove("session_id")
    };

    // descodifica o token
    function decodeToken(token) {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            return null;
        }
    }

    // Agenda a renovação automática do token
    function scheduleTokenRefresh(token) {
        if (refreshTimeout) clearTimeout(refreshTimeout);

        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
            throw new Error("Token inválido ou sem campo exp.")
        }

        // Calcula o tempo até a expiração (em ms)
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeUntilRefresh = expirationTime - currentTime - 60 * 1000; // 1 minuto antes de expirar

        if (timeUntilRefresh > 0) {
            refreshTimeout = setTimeout(async () => {
                try {
                    const session_id = Cookies.get("session_id")
                    await refreshToken(session_id);
                } catch (error) {
                    console.error("Erro ao renovar o token automaticamente:", error);
                }
            }, timeUntilRefresh);
        }
    }

    function setRefreshTokenFromCookies(token) {
        const refreshToken = String(token)
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getDate() + 7);
        Cookies.set("session_id", refreshToken, {
            secure: true,
            sameSite: "Strict",
            expires: expirationDate
        })
    }

    return {
        loading,
        error,
        register,
        updateUser,
        auth,
        logout,
        refreshToken,
        checkEmail,
        activeEmail,
        checkOTPPhone,
        checkOTPPassword,
        forgotPassword,
        resetPassword
    }
}