import axiosClient from "../../shared/services/axiosClient";
import { encryptAES } from "../../shared/utils/crypto";

export async function login(email, password) {
  const response = await axiosClient.post("/api/auth/login", {
    email,
    encryptedPassword: encryptAES(password),
  });
  return response.data.data; // { email, token, role, userId }
}

export async function register({
  firstName,
  lastName,
  email,
  password,
  identificationNumber,
  role,
}) {
  const response = await axiosClient.post("/api/auth/register", {
    firstName,
    lastName,
    email,
    encryptedPassword: encryptAES(password),
    identificationNumber: identificationNumber || "",
    role: "SELLER",
  });
  return response.data.data;
}

export async function changePassword(currentPassword, newPassword) {
  const response = await axiosClient.put("/api/auth/change-password", {
    currentEncryptedPassword: encryptAES(currentPassword),
    newEncryptedPassword: encryptAES(newPassword),
  });
  return response.data;
}

export async function getMyProfile() {
  const response = await axiosClient.get("/api/users/me");
  return response.data.data;
}

export async function getPersonalInfo() {
  const response = await axiosClient.get("/api/users/me/personal-info");
  return response.data.data;
}

export async function updatePersonalInfo({ firstName, lastName, phoneNumber, dateOfBirth }) {
  const response = await axiosClient.put("/api/users/me/personal-info", {
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
  });
  return response.data.data;
}

export async function deactivateAccount() {
  const response = await axiosClient.delete("/api/users/me");
  return response.data;
}
