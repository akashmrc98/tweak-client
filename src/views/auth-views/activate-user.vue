<template lang="pug">
  dialog-box(:color='color' :message='message', :action='close' :dialog='dialog')
</template>

<script>
import Dialog from "../../components/auth-components/dialog";
import gql from "graphql-tag";
import ACTIVATE_USER from "../../graphql/auth/activateUser.gql";
export default {
  components: {
    "dialog-box": Dialog
  },
  data() {
    return {
      dialog: false,
      message: "",
      color: ""
    };
  },
  mounted() {
    this.activate();
  },
  methods: {
    async activate() {
      const token = this.$route.params.token;
      this.$apollo.mutate({
        mutation: gql`
          ${ACTIVATE_USER}
        `,
        variables: {
          token: token
        },
        update: () => {
          this.message = "Account have been activated";
          this.color = "success";
          this.dialog = true;
        }
      });
    },
    async close() {
      this.dialog = false;
      this.$router.push("/login");
    }
  }
};
</script>
