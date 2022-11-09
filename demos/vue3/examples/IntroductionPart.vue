<script lang="ts" setup>
import GithubButton from 'vue-github-button'
</script>

<template>
  <h1 class="article-title">vuejs-confirm-dialog</h1>
  <div class="flex justify-center mb-4 gap-1">
    <github-button
      href="https://github.com/harmyderoman/vuejs-confirm-dialog/issues"
      data-icon="octicon-issue-opened"
      data-size="large"
      data-show-count="true"
      aria-label="Issue harmyderoman/vuejs-confirm-dialog on GitHub"
    >
      Issue
    </github-button>
    <github-button
      href="https://github.com/harmyderoman/vuejs-confirm-dialog"
      data-icon="octicon-star"
      data-size="large"
      data-show-count="true"
      aria-label="Star harmyderoman/vuejs-confirm-dialog on GitHub"
    >
      Star
    </github-button>
  </div>

  <h2 class="card-title">Introduction</h2>
  <p>
    This <a class="link link-primary" href="https://github.com/harmyderoman/vuejs-confirm-dialog" target="_blank">package</a> just makes it simple to create, reuse, promisify, and build
    chains of modal dialogs in Vue.js. For now, it provides just one function
    <code class="inline-code">createConfirmDialog</code> that does all the hard work for you.
  </p>
  <div class="warning-block">
    <p class="warning-block_title">Warning!</p>
    <p>This package does not provide components for now. These examples are not production-ready components! Use it on your own risk!</p>
  </div>
  <div class="divider"></div>
</template>

<style>

</style>
