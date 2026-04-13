import { useState } from "react";
import { getEmailError, getPasswordError } from "../../../shared/utils/validation";
import { login } from "../services/authService";
import { getCurrentUser } from "@/shared/utils/authApi";
const INITIAL_STATE = {
  email: "",
  password: "",
};

const INITIAL_ERRORS = {
  email: "",
  password: "",
};

export function useLoginForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (loginError) setLoginError("");
  }

  function validateForm() {
    const emailError = getEmailError(formData.email);
    const passwordError = getPasswordError(formData.password);

    const newErrors = {
      email: emailError || "",
      password: passwordError || "",
    };

    setErrors(newErrors);
    return !emailError && !passwordError;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");

    try {
    await login(formData);

    const me = await getCurrentUser();

    return {
      success: true,
      user: {
        email: me.email,
        name: me.name,
        role: me.roleName
      }
    };

    } catch (err) {
      const message =
        err.response?.data?.message || "Email hoặc mật khẩu không chính xác";

      setLoginError(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return {
    formData,
    errors,
    showPassword,
    isLoading,
    rememberMe,
    loginError,
    handleChange,
    handleSubmit,
    toggleShowPassword,
    setRememberMe,
  };
}
