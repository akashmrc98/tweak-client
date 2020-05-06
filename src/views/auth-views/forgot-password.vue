<template lang="pug">
center
  .insideComponent
    dialog-box(:color='color', :message='message', :action='close' :dialog='dialog')
    v-card.centerComponent(class='blue-grey darken-4')
      form-header
      v-card-title(dark).justify-center Trouble logging in?
      v-card-text(dark) Enter your email and we'll send you a link to get back into your account.

      .forgotPasswordComponent
      
        v-text-field(
          outlined
          label='Email', 
          required='', 
          autocomplete='off'
          v-model='email'
          :error-messages='emailErrors'
          @input='$v.email.$touch()'
          @blur='$v.email.$touch()'
          )
        v-btn.ma-3(color='primary' @click.prevent='sendToken')
          | Send Link
          v-icon(small right) vpn_key

        v-divider.ma-5.pa-3

        p.ma-3 have an account? 
          router-link.unlink(to='/login') Login

        p.pa-1 Don't have an account? 
          router-link.unlink(to='/signup') Create new account

        
</template>
<script>
import Header from "../../components/auth-components/header";
import Dialog from "../../components/auth-components/dialog";
import FETCH_USERS from "../../graphql/auth/fetchUsers.gql";
import GENERATE_PASSWORD_TOKEN from "../../graphql/auth/generatePasswordToken.gql";
import gql from "graphql-tag";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: "",
      message: "",
      dialog: false,
      color: ""
    };
  },
  components: {
    "form-header": Header,
    "dialog-box": Dialog
  },
  apollo: {
    users: gql`
      ${FETCH_USERS}
    `
  },

  mixins: [validationMixin],

  validations: {
    email: {
      required,
      email,
      isTaken(emailInput) {
        try {
          var index = this.users.findIndex(({ email }) => {
            return emailInput == email;
          });
          if (index == 0) return true;
          else return false;
        } catch (error) {
          return true;
        }
      }
    }
  },

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push("email is required.");
      !this.$v.email.email && errors.push("invalid email type.");
      !this.$v.email.isTaken && errors.push("Invalid email.");
      return errors;
    }
  },
  methods: {
    async sendToken() {
      this.$apollo.mutate({
        mutation: gql`
          ${GENERATE_PASSWORD_TOKEN}
        `,
        variables: {
          email: this.email
        },
        update: () => {
          if (!this.$v.email.$error && !this.email == "") {
            this.color = "success";
            this.message =
              "Password resetting link has been sent to your mail.";
          } else {
            this.color = "warning";
            this.message = "Invalid email";
          }
          this.dialog = true;
        }
      });
    },
    async close() {
      if (this.color == "warning") {
        this.dialog = false;
        this.color = "";
        this.message = "";
      }
      if (this.color == "success") {
        this.dialog = false;
        this.color = "";
        this.message = "";
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style scoped>
.forgotPasswordComponent {
  padding: 10%;
  height: 360px;
}

.insideComponent {
  width: 75%;
}
</style>
