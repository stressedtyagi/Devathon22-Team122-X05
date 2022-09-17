import Router from "./routes";
import { SnackbarProvider } from "notistack";

// SnackbarProvider is a component that provides a context for the snackbar
function App() {
    return (
        <SnackbarProvider maxSnack={5}>
            <Router />
        </SnackbarProvider>
    );
}

export default App;
