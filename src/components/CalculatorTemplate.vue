<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex fill-height">
      <v-row class="d-flex justify-center">
        <v-col cols="6">
          <v-form @submit.prevent class="pl-4">
            <h2>Cestovné poistenie</h2>
            <v-select
              v-model="variant"
              :items="variants"
              item-title="name"
              item-value="value"
              label="Variant poistenia"
              :hint="variant ? '' : 'Povinné pole'"
              persistent-hint
              :rules="required"
            >
            </v-select>
            <v-row class="d-flex align-center justify-center mt-4 mb-4">
              <span>
                <span class="p-float-label">
                  <Calendar
                    v-model="startDate"
                    dateFormat="dd.mm.yy"
                    required
                    :minDate="todayDate"
                  />
                  <label for="startDate">Začiatok poistenia</label>
                </span>
                <p
                  class="date"
                  :class="
                    startDate === undefined ? 'visibilityOn' : 'visibilityOff'
                  "
                >
                  Povinné pole
                </p>
              </span>
              <span v-if="variant === 'short'">
                <span class="p-float-label">
                  <Calendar
                    v-model="endDate"
                    dateFormat="dd.mm.yy"
                    :minDate="startDate"
                    required
                  />
                  <label for="endDate">Koniec poistenia</label>
                </span>
                <p
                  class="date"
                  :class="
                    endDate === undefined ? 'visibilityOn' : 'visibilityOff'
                  "
                >
                  Povinné pole
                </p>
              </span>
            </v-row>

            <v-select
              v-model="orderedPackage"
              :items="orderPackage"
              item-title="name"
              item-value="value"
              label="Balík služieb"
              :rules="required"
              :hint="orderedPackage ? '' : 'Povinné pole'"
              persistent-hint
            >
            </v-select>

            <h4 class="mt-3">Pripoistenia</h4>

            <v-checkbox
              v-model="storno"
              label="možnosť stornovať cesty"
            ></v-checkbox>

            <v-checkbox
              v-model="sportActivity"
              label="športové aktivty"
            ></v-checkbox>

            <v-select
              v-model="persons"
              :items="labels"
              :rules="required"
              label="Počet osôb"
              required
            ></v-select>
          </v-form>
        </v-col>

        <v-col cols="4">
          <v-card class="mb-3">
            <v-card-text v-if="orderedPackage !== ''">
              Vybraný balík obsahuje:

              <v-list lines="one">
                <v-list-item
                  v-for="item in orderPackage.find(
                    (e) => e.value === orderedPackage
                  )?.items"
                  :key="item.id"
                  :title="item.title"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          <v-card v-if="price > 0">
            <v-card-text>
              <p class="price">Aktuálna cena poistenia je</p>
              <p class="price text-center mt-3">
                <strong>{{ price.toFixed(2) }} €</strong>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn class="mt-8" @click="dialog = true"> Zaplatiť </v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else>
            <v-card-text>
              <p>Pre zobrazenie sumy vyplňte povinné polia</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text> Počkajte na presmerovanie na platobnú bránu </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">Zavrieť</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
const dialog = ref(false);
const labels = ["1", "2", "3"];
const todayDate = ref(new Date());

const required = ref([
  (value: any) => {
    if (value) return true;

    return "Povinné pole";
  },
]);

const variants = reactive([
  { name: "Krátkodobé ", value: "short" },
  { name: "Dlhodobé", value: "long" },
]);

const variant = ref();
const startDate = ref();
const endDate = ref();
const orderedPackage = ref("");
const orderPackage = reactive([
  {
    name: "Základný",
    value: "basic",
    shortPrice: 1.2,
    longPrice: 39,
    items: [{ id: 1, title: "prvý dôvod" }],
  },
  {
    name: "Rozšírený",
    value: "extended",
    shortPrice: 1.8,
    longPrice: 49,
    items: [
      { id: 1, title: "prvý dôvod" },
      { id: 2, title: "druhý dôvod" },
    ],
  },
  {
    name: "Extra",
    value: "extra",
    shortPrice: 2.4,
    longPrice: 59,
    items: [
      { id: 1, title: "prvý dôvod" },
      { id: 2, title: "druhý dôvod" },
      { id: 3, title: "tretí extra dôvod" },
    ],
  },
]);
const storno = ref(false);
const sportActivity = ref(false);
const persons = ref(1);

const price = computed(() => {
  if (
    variant.value === "long" &&
    orderedPackage.value !== "" &&
    startDate.value !== undefined
  ) {
    const ordered = orderPackage.find((p) => p.value === orderedPackage.value);
    if (ordered?.longPrice) {
      const stornoPrice = storno.value ? ordered?.longPrice / 5 : 0;
      const sportPrice = sportActivity.value ? ordered?.longPrice / 10 : 0;
      return (ordered?.longPrice + stornoPrice + sportPrice) * persons.value;
    }
  }
  if (
    variant.value === "short" &&
    orderedPackage.value !== "" &&
    startDate.value !== undefined &&
    endDate.value !== undefined
  ) {
    const ordered = orderPackage.find((p) => p.value === orderedPackage.value);
    const numberOfDays =
      1 +
      (endDate?.value.getTime() - startDate?.value.getTime()) /
        (1000 * 3600 * 24);

    if (ordered?.shortPrice && numberOfDays >= 1) {
      const stornoPrice = storno.value
        ? (ordered?.shortPrice / 2) * numberOfDays
        : 0;
      const sportPrice = sportActivity.value
        ? (ordered?.shortPrice / 10) * 3 * numberOfDays
        : 0;
      return (
        (ordered?.shortPrice * numberOfDays + stornoPrice + sportPrice) *
        persons.value
      );
    }
  }
  return 0;
});
</script>

<style scoped>
.date {
  font-size: 12px;
  transition-duration: 150ms;
  color: #838383;
  letter-spacing: 0.0333333333em;
  display: block;
}
.visibilityDate {
  visibility: visible;
}
.visibilityOff {
  visibility: hidden;
}
.price {
  font-size: 24px;
}
input,
label {
  margin: 0.4rem 0;
}
</style>
