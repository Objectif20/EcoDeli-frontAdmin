import { useEffect, useState } from "react";
import AppRoutes from "./routes/routes";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Spinner } from "./components/ui/spinner";
import { initI18n } from "./i18n";

function App() {
  const admin = useSelector((state: RootState) => state.admin.admin);
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const setupLanguage = async () => {
      const localLang = localStorage.getItem("i18nextLng");
      const userLang = localLang || admin?.language || "fr";

      await initI18n(userLang);
      localStorage.setItem("i18nextLng", userLang);
      setI18nReady(true);
    };

    setupLanguage();
  }, [admin]);

  if (!i18nReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
