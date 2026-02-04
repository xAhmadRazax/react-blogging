import { axios } from "@/lib/utils/axios.util";
import { RegisterSchema } from "@/lib/zodSchemas/auth.schema";

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
