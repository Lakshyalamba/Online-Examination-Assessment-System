import { CredentialsSignin } from "next-auth";

export class InactiveAccountError extends CredentialsSignin {
  code = "inactive_account";
}

export class AuthenticationUnavailableError extends CredentialsSignin {
  code = "service_unavailable";
}
