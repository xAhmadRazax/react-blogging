import { User } from "@/lib/types/user.type";
import { axios, setAccessToken } from "@/lib/utils/axios.util";
import { fetcherGet } from "@/lib/utils/fetcher";
import { LoginSchema, RegisterSchema } from "@/lib/zodSchemas/auth.schema";

// export const dynamic = "force-dynamic";

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

// export async function getMe(): Promise<User | null> {
//   try {
//     const {
//       data: { data },
//     } = await axios.get("/auth/me");

//     return data.user;
//   } catch (error) {
//     console.log(error);
//     if (typeof window == "undefined") {
//       console.log("Server-side auth failed, will try client-side");
//       return null;
//     } else
//       throw (
//         (error &&
//           typeof error === "object" &&
//           "response" in error &&
//           error.response !== null &&
//           typeof error.response === "object" &&
//           "data" in error.response &&
//           error.response?.data) || {
//           error: "Network Error",
//         }
//       );
//   }
// }

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await fetcherGet("auth/me");

    return data.user;
  } catch (error) {
    console.log(error);
    if (typeof window == "undefined") {
      console.log("Server-side auth failed, will try client-side");
      return null;
    } else
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
