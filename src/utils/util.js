import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL;
const DBuUrl = process.env.REACT_APP_DB_URL;

export function isValidToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    if (!decodedToken) return null;

    return Date.now() < decodedToken.exp * 1000;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function saveToken(token) {
  try {
    const data = { email: localStorage.getItem("agent_email"), token: token };
    const response = await fetch(`${apiUrl}/save_fmc_token`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "mongodb-url": DBuUrl,
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    console.log(response.json());
  } catch (error) {
    console.log(error);
    return null;
  }
}
