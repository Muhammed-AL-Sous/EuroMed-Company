/** نمط البريد المستخدم في نماذج المصادقة */
export const AUTH_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function collectAuthEmailErrors(email, fieldKey = "email") {
  const trimmed = typeof email === "string" ? email.trim() : "";
  const out = {};
  if (!trimmed) {
    out[fieldKey] = "The Email Field is Required.";
    return out;
  }
  if (!AUTH_EMAIL_REGEX.test(trimmed)) {
    out[fieldKey] = "Invalid Email Format";
  }
  return out;
}

export const AUTH_USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

export function collectAuthUsernameErrors(username, fieldKey = "username") {
  const trimmed = typeof username === "string" ? username.trim() : "";

  if (!trimmed) {
    return {
      [fieldKey]: "The Username Field is Required.",
    };
  }

  if (!AUTH_USERNAME_REGEX.test(trimmed)) {
    return {
      [fieldKey]: "Invalid Username Format.",
    };
  }

  return {};
}

export function collectAuthLoginPasswordErrors(
  password,
  fieldKey = "password",
) {
  if (typeof password !== "string" || !password.length) {
    return {
      [fieldKey]: "The Password Field is Required.",
    };
  }

  return {};
}

export function collectAuthPasswordPolicyErrors(
  password,
  fieldKey = "password",
) {
  const out = {};
  if (!password) {
    out[fieldKey] = "The Password Field is Required.";
    return out;
  }
  if (
    password.length < 6 ||
    !/[a-zA-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    out[fieldKey] = "Min. 6 characters (letters & numbers).";
  }
  return out;
}

export function collectAuthPasswordConfirmationErrors(
  password,
  passwordConfirmation,
  confirmationFieldKey = "password_confirmation",
) {
  const out = {};
  if (!passwordConfirmation) {
    out[confirmationFieldKey] = "The Confirm Password Field is Required.";
    return out;
  }
  if (password !== passwordConfirmation) {
    out[confirmationFieldKey] = "Passwords Do Not Match.";
  }
  return out;
}

export function collectAuthNameErrors(name, fieldKey = "name") {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (trimmed) return {};
  return { [fieldKey]: "The Name Field is Required." };
}

export function mergeFieldErrors(...parts) {
  return Object.assign({}, ...parts);
}

/** @param {{ username: string, password: string }} values */
export function getLoginFormErrors(values) {
  return mergeFieldErrors(
    collectAuthUsernameErrors(values.username),
    collectAuthLoginPasswordErrors(values.password),
  );
}

/** @param {{ name: string, email: string, password: string, password_confirmation: string }} values */
export function getRegisterFormErrors(values) {
  return mergeFieldErrors(
    collectAuthNameErrors(values.name),
    collectAuthEmailErrors(values.email),
    collectAuthPasswordPolicyErrors(values.password),
    collectAuthPasswordConfirmationErrors(
      values.password,
      values.password_confirmation,
    ),
  );
}

/** @param {{ password: string, password_confirmation: string }} values */
export function getResetPasswordFormErrors(values) {
  return mergeFieldErrors(
    collectAuthPasswordPolicyErrors(values.password),
    collectAuthPasswordConfirmationErrors(
      values.password,
      values.password_confirmation,
    ),
  );
}

/** نفس منطق البريد لصفحة نسيت كلمة المرور (كائن خطأ بحقل email). */
export function getForgotPasswordEmailErrors(email) {
  return collectAuthEmailErrors(email, "email");
}
