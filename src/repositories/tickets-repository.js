import api from "@/api";
import { ref } from "vue";
import { useStore } from "vuex";

export function useTickets() {
  const loading = ref(false);
  const store = useStore();

  const getTickets = async ({ page, limit }) => {
    try {
      const response = await api.get("/tickets/user", {
        params: {
          page,
          limit,
        },
      });
      return response;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getPartakers = async ({ page, limit, eventId, status }) => {
    try {
      loading.value = true
      const response = await api.get("/tickets/partakers", {
        params: {
          eventId,
          page,
          limit,
          status,
        },
      });
      return response;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchUserTickets = async ({ page, keywords, limit }) => {
    try {
      const response = await api.get("/tickets/user/search", {
        params: {
          page,
          limit,
          keywords,
        },
      });
      return response;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTicketsLoadMore = async ({ page, limit }) => {
    try {
      loading.value = true;
      const response = await api.get("/tickets/user", {
        params: {
          page,
          limit,
        },
      });
      return response;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    getTickets,
    getTicketsLoadMore,
    searchUserTickets,
    getPartakers,
    loading,
  };
}
