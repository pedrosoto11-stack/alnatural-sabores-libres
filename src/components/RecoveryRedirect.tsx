import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Si el enlace de recuperación de contraseña aterriza en cualquier ruta
 * (por ejemplo el home), lo reenvía a /reset-password conservando los
 * parámetros/tokens para que el usuario pueda definir su nueva clave.
 */
const RecoveryRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/reset-password") return;

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(window.location.search);

    const type = hashParams.get("type") || queryParams.get("type");
    const hasRecoveryToken =
      type === "recovery" ||
      queryParams.get("token_hash") !== null ||
      (queryParams.get("code") !== null && type === "recovery");
    const hasAuthError =
      (hashParams.get("error") || queryParams.get("error")) !== null &&
      (hashParams.get("error_code") || queryParams.get("error_code") || "").includes("otp") ;

    if (hasRecoveryToken || hasAuthError) {
      navigate(
        `/reset-password${window.location.search}${window.location.hash}`,
        { replace: true }
      );
    }
  }, [location.pathname, navigate]);

  return null;
};

export default RecoveryRedirect;
