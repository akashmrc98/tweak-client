<template lang="pug">
center
  .insideComponent
    dialog-box(:color='color', :message='message', :action='closeError' :dialog='dialog')
    v-card(class='blue-grey darken-4').centerComponent
      form-header
      v-card-title.justify-center Login
      
      .loginComponent
        v-text-field(
          outlined
          v-model='User.userName', 
          :error-messages="usernameErrors"
          label='Username', 
          @input='$v.User.userName.$touch()', 
          @blur='$v.User.userName.$touch()'
          autocomplete='off'
          name='userName'
          )
        v-text-field(
          outlined
          v-model='User.password',
          :error-messages="passwordErrors"
          label='password', 
          :append-icon="show ? 'visibility_off' : 'visibility'" 
          :type="show ? 'password' : 'text'"
          @input='$v.User.userName.$touch() ',   
          @click:append="show = !show"
          autocomplete='off'
          @blur='$v.User.password.$touch()'
          name='password'
          )
        v-btn.ma-5(color='primary', id='LoginMe' @click.prevent="finalValidationCheck")
          | Login
          v-icon(small right) lock_open

        v-divider.ma-5(dark)
        p Don't have an account? 
          router-link.unlink(to='/signup') Signup
        p 
          router-link.unlink(to='/forgot-password') Forgot password?
</template>

<script>
import gql from "graphql-tag";
import AUTHENTICATE from "../../graphql/auth/authenticateUser.gql";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import FETCH_USERS from "../../graphql/auth/fetchUsers.gql";
import Header from "../../components/auth-components/header";
import Dialog from "../../components/auth-components/dialog";
export default {
  mixins: [validationMixin],

  validations: {
    User: {
      userName: {
        required,
        inUse(userNameInput) {
          var index = this.users.findIndex(({ userName }) => {
            return userNameInput == userName;
          });
          if (index == 0) return true;
          else return false;
        }
      },
      password: { required }
    },
    show: false
  },

  components: {
    "form-header": Header,
    "dialog-box": Dialog
  },

  data: () => ({
    User: {
      userName: "",
      password: ""
    },
    dialog: false,
    show: true,
    message: "",
    color: ""
  }),

  apollo: {
    users: gql`
      ${FETCH_USERS}
    `
  },

  mounted() {},
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.User.userName.$dirty) return errors;
      !this.$v.User.userName.required && errors.push("username is required.");
      !this.$v.User.userName.inUse && errors.push("invalid username.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.User.password.$dirty) return errors;
      !this.$v.User.password.required && errors.push("password is required");
      return errors;
    }
  },

  methods: {
    async clear() {
      this.$v.$reset();
      this.User = {
        userName: "",
        password: ""
      };
    },
    async finalValidationCheck() {
      if (this.$v.$anyError || this.$v.$invalid) {
        this.dialog = true;
        this.color = "warning";
        this.message = "Invalid credentials.";
      } else {
        this.Authenticate();
      }
    },
    async closeError() {
      this.dialog = false;
      this.message = "";
    },
    async Authenticate() {
      this.$apollo.mutate({
        mutation: gql`
          ${AUTHENTICATE}
        `,
        variables: {
          userName: this.User.userName,
          password: this.User.password
        },
        update: (cache, { data: { authenticateUser } }) => {
          if (authenticateUser.__typename === "LoginToken") {
            localStorage.setItem("token", authenticateUser.token);
            this.clear();
            this.$router.push("/home");
          }
          if (authenticateUser.__typename === "LoginError") {
            this.dialog = true;
            this.message = authenticateUser.message;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.loginComponent {
  padding: 3%;
  margin: 3%;
}

.insideComponent {
  width: 75%;
}
</style>
