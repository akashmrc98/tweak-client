<template lang="pug">
  center
    v-card(class='blue-grey darken-4').centerComponent
      form-header
      v-card-title.justify-center Signup
      v-row.signupComponent
        v-col

          v-text-field(
            label='Firstname'
            outlined
            name='firstName'
            v-model='User.firstName'
            :error-messages='firstNameErrors'
            @input='$v.User.firstName.$touch()', 
            @blur='$v.User.firstName.$touch()'
            autocomplete='off' 
          )

          v-text-field(
            label="lastname"
            outlined
            v-model='User.lastName'
            :error-messages='lastNameErrors'
            @input='$v.User.lastName.$touch()', 
            @blur='$v.User.lastName.$touch()'
            autocomplete='off'
            name='lastName'
          )

          v-text-field(
            label='Username'
            outlined
            v-model='User.userName',
            :error-messages='userNameErrors'
            @input='$v.User.userName.$touch()'
            @blur='$v.User.userName.$touch()'
            autocomplete='off'
            name='userName'
          )

          v-dialog(v-model='dialog_dob', max-width='290')
            template(v-slot:activator='{ on }')
              v-text-field(
              label='Date of birth' 
              outlined 
              v-model='User.dob' 
              name='dob' 
              v-on='on'
              autocomplete='off'
              ) Date of birth

            v-card
              v-date-picker(v-model='date') 
                v-btn(
                color='success' 
                @click.append="dialog_dob = !dialog_dob" 
                @click.prevent="assignDate"
                id='closeMe'
                ) Close

          v-select(
            label="Gender" 
            outlined 
            :items='gender'
            v-model='User.gender'
            :error-messages='genderErrors'
            @input='$v.User.gender.$touch()'
            @blur='$v.User.gender.$touch()'
            autocomplete='off'
            name='gender'
            )

        v-col

          v-text-field(
            label='Email'
            outlined 
            v-model='User.email'
            :error-messages='emailErrors'
            @input='$v.User.email.$touch()'
            @blur='$v.User.email.$touch()'
            autocomplete='off'
            name='email'
          )

          v-text-field(
            label='Phone'
            outlined 
            v-model='User.phone'
            :error-messages='phoneErrors'
            @input='$v.User.phone.$touch()'
            @blur='$v.User.phone.$touch()'
            autocomplete='off'
            name='phone'
          )     

          v-text-field(
            label='Password'
            outlined 
            :append-icon="pshow ? 'visibility_off' : 'visibility'" 
            :type="pshow ? 'password' : 'text'"
            @click:append="pshow = !pshow"
            v-model='User.password'
            :error-messages='passwordErrors'
            @input='$v.User.password.$touch()'
            @blur='$v.User.password.$touch()'
            autocomplete='off'
            name='password'
          )

          v-text-field(
            label='Confirm password'
            outlined 
            :append-icon="cpshow ? 'visibility_off' : 'visibility'" 
            :type="cpshow ? 'password' : 'text'"
            @click:append="cpshow = !cpshow"
            v-model='User.confirmPassword'
            :error-messages='confirmPasswordErrors'
            @input='$v.User.confirmPassword.$touch()'
            @blur='$v.User.confirmPassword.$touch()'
            name='confirmPassword'
          )

      v-btn.ma-2.primary(@click.prevent="finalValidationCheck" id='signMe')
        | Signup
        v-icon(small right) account_circle    

      v-divider.ma-5(dark) 

      p.pa-5 Have account? 
        router-link.unlink(to='/login') Login

      dialog-box(:color='color', :message='message', :action='close' :dialog='dialog')
</template>

<script>
import gql from "graphql-tag";
import CREATE_NEW_USER from "../../graphql/auth/createNewUser.gql";
import FETCH_USERS from "../../graphql/auth/fetchUsers.gql";
import { validationMixin } from "vuelidate";
import Dialog from "../../components/auth-components/dialog";
import Header from "../../components/auth-components/header";
import {
  required,
  minLength,
  maxLength,
  email,
  alphaNum,
  numeric,
  sameAs
} from "vuelidate/lib/validators";
export default {
  components: {
    "form-header": Header,
    "dialog-box": Dialog
  },

  data() {
    return {
      User: {
        firstName: "",
        lastName: "",
        userName: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      },
      color: "",
      dialog_dob: false,
      dialog: false,
      pshow: true,
      cpshow: true,
      date: "",
      message: "",
      gender: ["male", "female", "others"]
    };
  },

  apollo: {
    users: gql`
      ${FETCH_USERS}
    `
  },

  methods: {
    async assignDate() {
      this.User.dob = this.date;
    },
    async close() {
      if (this.color == "warning") {
        this.dialog = false;
        this.message = "";
      }
      if (this.color == "success") {
        this.dialog = false;
        this.message = "";
        this.$router.push("/login");
      }
    },

    async finalValidationCheck() {
      if (this.$v.$anyError || this.$v.$invalid) {
        this.message = "Invalid form data please refill form";
        this.color = "warning";
        this.dialog = true;
      } else {
        await this.createNewUser();
      }
    },

    async createNewUser() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            ${CREATE_NEW_USER}
          `,
          variables: {
            firstName: this.User.firstName,
            lastName: this.User.lastName,
            userName: this.User.userName,
            dob: this.User.dob,
            gender: this.User.gender,
            email: this.User.email,
            phone: this.User.phone,
            password: this.User.password
          },
          update: () => {
            this.message =
              "An email has been sent to your mail, to authorize the mail.";
            this.color = "success";
            this.dialog = true;
          }
        });
      } catch (error) {
        this.dialog = true;
        this.color = "danger";
        this.message = error;
      }
    }
  },

  mixins: [validationMixin],

  validations: {
    User: {
      firstName: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(24)
      },
      lastName: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(24)
      },
      userName: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(24),
        alphaNum,
        isTaken(userNameInput) {
          try {
            var index = this.users.findIndex(({ userName }) => {
              return userNameInput == userName;
            });
            if (index == 0) return false;
            else return true;
          } catch (error) {
            return true;
          }
        }
      },
      dob: {
        required
      },
      gender: {
        required
      },
      email: {
        required,
        email,
        isTaken(emailInput) {
          try {
            var index = this.users.findIndex(({ email }) => {
              return emailInput == email;
            });
            if (index == 0) return false;
            else return true;
          } catch (error) {
            return true;
          }
        }
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(12),
        isTaken(phoneInput) {
          try {
            var index = this.users.findIndex(({ phone }) => {
              return phoneInput == phone;
            });
            if (index == 0) return false;
            else return true;
          } catch (error) {
            return true;
          }
        }
      },
      password: {
        required,
        alphaNum,
        minLength: minLength(8),
        maxLength: maxLength(24)
      },
      confirmPassword: {
        required,
        same: sameAs("password")
      }
    }
  },
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.User.firstName.$dirty) return errors;
      !this.$v.User.firstName.required && errors.push("firstname is required.");
      !this.$v.User.firstName.minLength && errors.push("minimum 4 characters.");
      !this.$v.User.firstName.maxLength &&
        errors.push("maximum 24 characters.");
      return errors;
    },

    lastNameErrors() {
      const errors = [];
      if (!this.$v.User.lastName.$dirty) return errors;
      !this.$v.User.lastName.required && errors.push("lastname is required.");
      !this.$v.User.lastName.minLength && errors.push("minimum 4 characters.");
      !this.$v.User.lastName.maxLength && errors.push("maximum 24 characters.");
      return errors;
    },

    userNameErrors() {
      const errors = [];
      if (!this.$v.User.userName.$dirty) return errors;
      !this.$v.User.userName.alphaNum &&
        errors.push("username is alpha-numeric.");
      !this.$v.User.userName.required && errors.push("username is required.");
      !this.$v.User.userName.minLength && errors.push("minimum 8 characters.");
      !this.$v.User.userName.maxLength && errors.push("maximum 24 characters.");
      !this.$v.User.userName.isTaken &&
        errors.push("username is already in use");
      return errors;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.User.email.$dirty) return errors;
      !this.$v.User.email.required && errors.push("email is required.");
      !this.$v.User.email.email && errors.push("invalid email type.");
      !this.$v.User.email.isTaken &&
        errors.push("Email already is already in use");
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.User.phone.$dirty) return errors;
      !this.$v.User.phone.required && errors.push("phone-no is required.");
      !this.$v.User.phone.minLength && errors.push("minimum 10 characters.");
      !this.$v.User.phone.maxLength && errors.push("maximum 12 characters.");
      !this.$v.User.phone.numeric &&
        errors.push("phone-no only contains digits.");
      !this.$v.User.phone.isTaken &&
        errors.push("phone number is already in use");
      return errors;
    },

    genderErrors() {
      const errors = [];
      if (!this.$v.User.gender.$dirty) return errors;
      !this.$v.User.gender.required && errors.push("gender is required.");
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.User.password.$dirty) return errors;
      !this.$v.User.password.required && errors.push("password is required.");
      !this.$v.User.password.minLength && errors.push("minimum 8 characters.");
      !this.$v.User.password.maxLength && errors.push("maximum 24 characters.");
      !this.$v.User.password.alphaNum &&
        errors.push("password should alpha-numeric.");
      return errors;
    },

    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.User.confirmPassword.$dirty) return errors;
      !this.$v.User.confirmPassword.required &&
        errors.push("confirm password is required.");
      !this.$v.User.confirmPassword.same &&
        errors.push("password does not match.");
      return errors;
    }
  }
};
</script>

<style scoped>
.signupComponent {
  padding: 1%;
  margin: 1%;
}
</style>
