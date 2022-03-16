<template>
  <VeeForm
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <div
      class="text-white text-center font-bold p-5 mb-4"
      v-if="reg_show_alert"
      :class="reg_alert_variant"
    >
      {{ reg_alert_msg }}
    </div>
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
        name="name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
        name="email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        name="age"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <div
          class="text-red-600"
          v-for="error in errors"
          v-text="error"
          :key="error"
        />
      </VeeField>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
        name="confirm_password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Choose one"
      >
        <option value="none">Does not exist</option>
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Poland">Poland</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
        name="tos"
        type="checkbox"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service&nbsp;</label>
      <ErrorMessage class="text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      Submit
    </button>
  </VeeForm>
</template>

<script>
export default {
  name: 'RegisterForm',
  data () {
    return {
      schema: {
        name: 'required|min:2|max:100|alpha_spaces',
        email: 'required|email|min:7|max:100',
        age: 'required|integer|min_value:18|max_value:130',
        password: 'required|min:3|max:100',
        confirm_password: 'required|passwords_mismatch:@password',
        country: 'required|country_excluded:none',
        tos: 'tos'
      },
      userData: {
        country: 'Poland'
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.'
    }
  },
  methods: {
    register (values) {
      this.reg_in_submission = true
      this.reg_show_alert = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = 'Please wait! Your account is being created.'

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = 'Success! Your account has been created'
      console.log(values)
    }
  }
}
</script>
