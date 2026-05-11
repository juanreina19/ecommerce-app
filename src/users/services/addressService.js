import axiosClient from "../../shared/services/axiosClient";

export async function getMyAddresses() {
  const response = await axiosClient.get("/api/users/me/addresses");
  return response.data.data;
}

export async function addAddress({ city, country, state, street, zipCode, isDefault }) {
  const response = await axiosClient.post("/api/users/me/addresses", {
    city,
    country,
    state,
    street,
    zipCode,
    isDefault: isDefault ?? false,
  });
  return response.data.data;
}

export async function updateAddress(addressId, { city, country, state, street, zipCode, isDefault }) {
  const response = await axiosClient.put(`/api/users/me/addresses/${addressId}`, {
    city,
    country,
    state,
    street,
    zipCode,
    isDefault: isDefault ?? false,
  });
  return response.data.data;
}

export async function deleteAddress(addressId) {
  const response = await axiosClient.delete(`/api/users/me/addresses/${addressId}`);
  return response.data;
}
