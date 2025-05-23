import { StatusBar } from "react-native"
import AppNavigator from "./src/navigation/AppNavigator"
import { ToastProvider } from './src/context/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </ToastProvider>
  )
}
