// Fetch all users directly from backend
export const getAllUsers = async (token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed - Please login again");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users directly:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (token, userId, data) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Failed to update user");
  return response.json();
};

// Patch user
export const patchUser = async (token, userId, data) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Failed to patch user");
  return response.json();
};

// Delete user
export const deleteUser = async (token, userId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to delete user");
  return response.json();
};
