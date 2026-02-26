import api from "./api";

// 🔹 register user
export const registerUser = (data) => {
    console.log(1,data)
  return api.post("/auth/register", data);
};

// 🔹 login user
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};