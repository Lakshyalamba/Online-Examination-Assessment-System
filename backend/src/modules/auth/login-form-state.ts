export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  fields?: {
    name?: string;
    email?: string;
  };
};

export type LoginFormState = AuthFormState;
export type SignupFormState = AuthFormState;

export const initialLoginFormState: LoginFormState = {
  status: "idle",
};

export const initialSignupFormState: SignupFormState = {
  status: "idle",
};
