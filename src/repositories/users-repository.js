// Importa a instância da API configurada para fazer requisições ao backend.
import api from "../api";

// Importa `ref` do Vue para criar variáveis reativas.
import { ref } from "vue";

// Importa `useStore` do Vuex para acessar o estado global da aplicação.
import { useStore } from "vuex";

// Importa a biblioteca js-cookie para manipulação de cookies.
import Cookies from "js-cookie";

// Exporta a função `useUsers`, que retorna métodos relacionados à autenticação e gerenciamento de usuários.
export function useUsers() {
  // Variável reativa para indicar carregamento de alguma operação assíncrona.
  const loading = ref(false);

  // Variável reativa para armazenar possíveis erros.
  const error = ref(false);

  // Obtém a instância do Vuex Store.
  const store = useStore();

  // Função assíncrona para registrar um novo usuário.
  const register = async (data) => {
    try {
      loading.value = true; // Ativa o estado de carregamento.
      await api.post("/users/register", data); // Envia os dados do usuário para o backend.

      store.dispatch("setUser", data); // Atualiza o estado global do usuário.
    } catch (err) {
      console.log(err.message); // Exibe o erro no console.
      throw err; // Relança o erro.
    } finally {
      loading.value = false; // Desativa o estado de carregamento.
    }
  };

  // Função para renovar o token de acesso.
  const refreshToken = async (session_id) => {
    try {
      loading.value = true;
      await api
        .post("/users/refresh-access-token", { session_id })
        .then((res) => {
          const user = res.data.user;
          const accessToken = res.data.access_token;

          store.dispatch("setUser", user); // Atualiza o usuário no estado global.
          store.dispatch("setAccessToken", accessToken); // Atualiza o token no estado global.
        })
        .finally(() => {
          loading.value = false;
        });
    } catch (err) {
      console.log(err);
      clearRefreshToken(); // Limpa o token armazenado.
      console.log(err.message);
      throw err;
    }
  };

  // Função para autenticar o usuário.
  const auth = async (data) => {
    try {
      loading.value = true;

      const response = await api.post("/users/auth", data);
      const user = response.data.user;
      const accessToken = response.data.access_token;
      const sessionId = response.data.session_id;

      store.dispatch("setUser", user);
      store.dispatch("setAccessToken", accessToken);

      setRefreshTokenFromCookies(sessionId);

      return response;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para autenticar o usuário.
  const googleAuth = async (data) => {
    try {
      loading.value = true;

      const response = await api.post("/users/google-auth", data);
      const user = response.data.user;
      const accessToken = response.data.access_token;
      const sessionId = response.data.session_id;

      store.dispatch("setUser", user);
      store.dispatch("setAccessToken", accessToken);

      //scheduleTokenRefresh(accessToken);
      setRefreshTokenFromCookies(sessionId);

      return response;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para verificar se um e-mail já está cadastrado.
  const checkEmail = async (email) => {
    try {
      loading.value = true;
      return await api.put("/users/check-email", { email });
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para ativar um e-mail com um token.
  const activeEmail = async (token) => {
    try {
      loading.value = true;
      return await api.put("/users/active-email", { token });
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para verificar um código OTP enviado por SMS.
  const checkOTPPhone = async (otp) => {
    try {
      loading.value = true;
      return await api.put(`/users/check-otp-phone/${otp}`);
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para verificar um código OTP para redefinição de senha.
  const checkOTPPassword = async (otp) => {
    try {
      loading.value = true;
      const response = await api.get(`/users/check-otp-reset-password/${otp}`);
      return response.data.otp;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para deslogar o usuário.
  const logout = async (session_id) => {
    try {
      if (
        !session_id ||
        typeof session_id !== "string" ||
        session_id.trim() === ""
      ) {
        throw new Error("ID de sessão inválido.");
      }

      loading.value = true;

      const response = await api.post(
        "/users/destroy-session",
        { session_id },
        { timeout: 10000 }
      );

      if (response.status === 200) {
        store.dispatch("setAccessToken", null);
        store.dispatch("setUser", {});
        clearRefreshToken();
      } else {
        throw new Error("Falha ao encerrar a sessão no servidor.");
      }
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
      store.dispatch("setAccessToken", null);
      store.dispatch("setUser", {});
      clearRefreshToken();
    } finally {
      loading.value = false;
    }
  };

  // Função para solicitar redefinição de senha.
  const forgotPassword = async (data) => {
    try {
      loading.value = true;
      const response = await api.post("/users/forgot-password", data);
      return response.data.user;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para atualizar os dados do usuário.
  const updateUser = async (data) => {
    try {
      loading.value = true;
      await api.put("/users", data);
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para redefinir a senha do usuário.
  const resetPassword = async (data) => {
    try {
      loading.value = true;
      return await api.put(`/users/reset-password/${data.otp}`, {
        new_password: data.new_password,
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Função para remover o token de sessão dos cookies.
  function clearRefreshToken() {
    Cookies.remove("session_id");
  }

  // Define o token de sessão nos cookies.
  function setRefreshTokenFromCookies(token) {
    Cookies.set("session_id", String(token), {
      secure: false,
      sameSite: "Strict",
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
  }

  return {
    loading,
    error,
    register,
    updateUser,
    auth,
    googleAuth,
    logout,
    refreshToken,
    checkEmail,
    activeEmail,
    checkOTPPhone,
    checkOTPPassword,
    forgotPassword,
    resetPassword,
  };
}
