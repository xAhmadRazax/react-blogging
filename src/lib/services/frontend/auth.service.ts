import { axios, setAccessToken } from "@/lib/utils/axios.util";
import { LoginSchema, RegisterSchema } from "@/lib/zodSchemas/auth.schema";

export async function register({
  email,
  name,
  gender,
  password,
  confirmPassword,
  dateOfBirth,
}: RegisterSchema) {
  try {
    const { data } = await axios.post("/auth/register", {
      email,
      name,
      gender,
      password,
      confirmPassword,
      dateOfBirth,
    });
  } catch (error) {
    console.log(error);
    throw (
      (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response !== null &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response?.data) || {
        error: "Network Error",
      }
    );
  }
}

export async function login({ email, password }: LoginSchema) {
  try {
    const {
      data: { data },
    } = await axios.post("/auth/login", {
      email,
      password,
    });

    setAccessToken(data.accessToken);

    return data;
  } catch (error) {
    console.log(error);
    throw (
      (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response !== null &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response?.data) || {
        error: "Network Error",
      }
    );
  }
}

export async function logout() {
  try {
    await axios("/auth/logout", {});
  } catch (error) {
    console.log(error);
    throw (
      (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response !== null &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response?.data) || {
        error: "Network Error",
      }
    );
  }
}

export async function getMe() {
  try {
    const {
      data: { data },
    } = await axios.get("/auth/me");

    return data.user;
  } catch (error) {
    console.log(error);
    throw (
      (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response !== null &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response?.data) || {
        error: "Network Error",
      }
    );
  }
}
