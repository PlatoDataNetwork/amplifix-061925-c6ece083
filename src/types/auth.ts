export interface SignInData {
  title: string;
  email_label: string;
  email_placeholder: string;
  password_label: string;
  password_placeholder: string;
  remember_me: string;
  forgot_password: string;
  submit_button: string;
  no_account: string;
  sign_up_link: string;
}

export interface SignUpData {
  title: string;
  name_label: string;
  name_placeholder: string;
  email_label: string;
  email_placeholder: string;
  password_label: string;
  password_placeholder: string;
  confirm_password_label: string;
  confirm_password_placeholder: string;
  submit_button: string;
  have_account: string;
  sign_in_link: string;
}

export interface AuthData {
  sign_in: SignInData;
  sign_up: SignUpData;
}
