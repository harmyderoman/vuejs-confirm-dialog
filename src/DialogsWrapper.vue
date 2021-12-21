<template>
	<component
		v-for="dialog in DialogsStore"
		:is="dialog.component"
		:show="unrefValue(dialog.isRevealed)"
		v-bind="dialog.props"
		@confirm="dialog.confirm"
		@cancel="dialog.cancel"
		:key="dialog"
	></component>
</template>

<script setup lang="ts">
import { unref } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'

const unrefValue = (val) => {
	return unref(val)
}

const { DialogsStore } = useDialogWrapper()
</script>
