<template>
  <v-app>
    <AppNavigation />
    <v-main>
      <CalculatorTemplate />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import AppFooter from "@/components/app/AppFooter.vue";
import CalculatorTemplate from "@/components/CalculatorTemplate.vue";
import AppNavigation from "./components/app/AppNavigation.vue";
</script>
