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
            const response = await api.post("/users/register", data)
            const user = response.data.newUser;

            store.dispatch("setUser", user)
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
    const checkEmail = async (token) => {
        try {
            loading.value = true

            const response = await api.put("/users/check-email/" + token)
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const logout = async (session_id) => {
        try {
            loading.value = true
            await api.post("/users/destroy-session", {
                session_id
            })

            store.dispatch("setUser", null)
            store.dispatch("setAccessToken", null)
            clearRefreshToken()
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }

    }

    const forgotPassword = async (data) => {
        try {
            loading.value = true
            await api.post("/users/forgot-password", data)
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
            return await api.put("/users/reset-password", {
                new_password: data.new_password,
                token: data.token
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
        expirationDate.setMonth(expirationDate.getDay() + 30);
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
        forgotPassword,
        resetPassword
    }
}