<template lang="pug">
center
  .insideComponent
    v-card(class='blue-grey darken-4').centerComponent
      form-header
      v-card-title.justify-center New password

      dialog-box(:color='color', :message='message', :action='close' :dialog='dialog')
          
      .signupComponent 

          v-text-field(
            label='Password'
            outlined 
            :append-icon="pshow ? 'visibility_off' : 'visibility'" 
            :type="pshow ? 'password' : 'text'"
            @click:append="pshow = !pshow"
            v-model='password'
            :error-messages='passwordErrors'
            @input='$v.password.$touch()'
            @blur='$v.password.$touch()'
            autocomplete='off'
            name='password'
          )

          v-text-field(
            label='Confirm password'
            outlined 
            :append-icon="cpshow ? 'visibility_off' : 'visibility'" 
            :type="cpshow ? 'password' : 'text'"
            @click:append="cpshow = !cpshow"
            v-model='confirmPassword'
            :error-messages='confirmPasswordErrors'
            @input='$v.confirmPassword.$touch()'
            @blur='$v.confirmPassword.$touch()'
            name='confirmPassword'
          )

      v-btn.ma-5.primary(@click.prevent="changePassword" id='signMe')
        | Change password
        v-icon(small right) account_circle    

      .ma-5.pa-5(dark) 


</template>

<script>
import gql from "graphql-tag";
import CHANGE_USER_PASSWORD from "../../graphql/auth/changeUserPassword.gql";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  alphaNum,
  sameAs
} from "vuelidate/lib/validators";
import Header from "../../components/auth-components/header";
import Dialog from "../../components/auth-components/dialog";
export default {
  components: {
    "form-header": Header,
    "dialog-box": Dialog
  },

  data() {
    return {
      password: "",
      confirmPassword: "",
      dialog: false,
      pshow: true,
      cpshow: true,
      message: "",
      color: ""
    };
  },

  methods: {
    async changePassword() {
      this.$apollo.mutate({
        mutation: gql`
          ${CHANGE_USER_PASSWORD}
        `,
        variables: {
          token: this.$route.params.token,
          password: this.password
        },
        update: () => {
          if (!this.$v.$anyError) {
            this.color = "success";
            this.message = "Password reset complete.";
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
  },

  mixins: [validationMixin],

  validations: {
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
  },
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("password is required.");
      !this.$v.password.minLength && errors.push("minimum 8 characters.");
      !this.$v.password.maxLength && errors.push("maximum 24 characters.");
      !this.$v.password.alphaNum &&
        errors.push("password should alpha-numeric.");
      return errors;
    },

    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required &&
        errors.push("confirm password is required.");
      !this.$v.confirmPassword.same && errors.push("password does not match.");
      return errors;
    }
  }
};
</script>

<style scoped>
.signupComponent {
  padding: 5%;
  margin: 2%;
}

.insideComponent {
  width: 80%;
}
</style>
