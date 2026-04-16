import { Redirect } from "expo-router";
import { useAuth } from "../src/auth/context/AuthContext";
import LoadingSpinner from "../src/shared/components/LoadingSpinner";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (isLoggedIn) {
    return <Redirect href="/(app)/products" />;
  }

  return <Redirect href="/(auth)/login" />;
}
