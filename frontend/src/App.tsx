import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoutesComponent from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoutesComponent />
    </QueryClientProvider>
  );
}

export default App;
