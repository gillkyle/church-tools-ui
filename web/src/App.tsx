import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { Directory } from "./components/Directory";
import { LoginForm } from "./components/LoginForm";
import { useAuthStore } from "./store/auth";

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  console.log({ isauthed: isAuthenticated });

  React.useEffect(() => {
    let authState = false;
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    console.log({ token });
    if (!token) authState = false;
    try {
      const payload = JSON.parse(atob(token?.split(".")[1] ?? ""));
      authState = payload.exp * 1000 > Date.now();
    } catch {
      authState = false;
    }
    // set the auth state
    setIsAuthenticated(authState);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {isAuthenticated ? <Directory /> : <LoginForm />}
    </QueryClientProvider>
  );
}

export default App;
