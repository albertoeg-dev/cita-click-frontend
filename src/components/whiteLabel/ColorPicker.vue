<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <div class="flex items-center gap-3">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="color"
        class="h-10 w-20 rounded border border-gray-300 cursor-pointer"
      />
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        pattern="^#[0-9A-Fa-f]{6}$"
        placeholder="#000000"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
      />
      <div
        :style="{ backgroundColor: modelValue }"
        class="w-10 h-10 rounded border border-gray-300"
        :title="modelValue"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String
})

defineEmits(['update:modelValue'])
</script>
