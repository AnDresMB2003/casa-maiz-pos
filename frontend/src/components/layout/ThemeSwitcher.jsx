import useTheme from "../../context/useTheme";
import Button from "./../../components/ui/Button";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      className="px-3 py-2 text-sm"
      onClick={toggleTheme}
    >
      {theme === "dark" ? "Modo claro" : "Modo oscuro"}
    </Button>
  );
}
