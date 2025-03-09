import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();
const BASE_URL_CITY = `http://localhost:8000`;

function CitiesProvider({ children }) {
  const initialState = {
    currentCity: {},
    cities: [],
    isLoading: false,
    error: "",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "loading":
        return { ...state, isLoading: true };

      case "cities/loaded":
        return { ...state, isLoading: false, cities: action.payload };

      case "city/loaded":
        return {
          ...state,
          isLoading: false,
          currentCity: action.payload,
        };

      case "city/created":
        return {
          ...state,
          isLoading: false,
          cities: [...state.cities, action.payload],
          currentCity: action.payload,
        };

      case "city/deleted":
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter((el) => el.id !== action.payload),
          currentCity: {},
        };

      case "rejected":
        return {
          ...state,
          error: action.payload,
        };
      default:
        throw new Error("Unknown action type");
    }
  }

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getCitiesData() {
      try {
        dispatch({ type: "loading" });

        const res = await fetch(`${BASE_URL_CITY}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }
    getCitiesData();
  }, []);

  const getCurrentCity = useCallback(async function getCurrentCity(id) {
    if (currentCity.id === Number(id)) return;
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL_CITY}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data",
      });
    }
  }, [currentCity.id]);

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL_CITY}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const createdCity = await res.json();

      dispatch({ type: "city/created", payload: createdCity });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating a new city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL_CITY}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Failed to delete the city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCurrentCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Using context outside context provider");

  return context;
}

export { useCities, CitiesProvider };
