<script lang="ts" setup>
import IntroductionPart from './examples/IntroductionPart.vue'
import BasicExample from './examples/BasicExample.vue'
import LoaderExample from './examples/LoaderExample.vue'
import TableExample from './examples/TableExample.vue'
import AlertExample from './examples/AlertExample.vue'

</script>

<template>
  <article class="main-container">
    <IntroductionPart />
    <BasicExample />
    <AlertExample />
    <LoaderExample />
    <TableExample />
  </article>

  <!-- put it in the template of your App.vue file to make this library work -->
  <div class="alerts-container">
    <DialogsWrapper />
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/daisyui@1.19.0/dist/full.css';
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css';

.alerts-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 5px;
  top: 20px;
  right: 40px;
  width: 380px;
}
.main-container {
  padding: 15px 30px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  background-color: white;
  box-shadow: #f2f2f2;
}
h1, h2 {
  text-align: center;
}

body {
  background-color: #f2f2f2;
  height: 100%;
  font-size: 16px;
}
.article-title {
  font-size: 36px;
  text-transform: capitalize;
  font-weight: 500;
  margin: 15px 0px;
}
.card {
  border: 2px solid #f0f0f0;
}
.code-card {
  background-color: #2f2f2f;
  color: #80cbc4;
}
.html-code {
  background: none; 
  border: none; 
  resize: none; 
  outline: none; 
  width: 100%;
  overflow: hidden;
}
.widget {
    display: inline-block;
    overflow: hidden;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
    font-size: 0;
    line-height: 0;
    white-space: nowrap;
}
.inline-code {
  background-color: #e3e2e2;
  border-radius: 5px;
  padding: 3px 5px;
}
.input {
  font-size: 18px!important;
}
.divider {
  margin-bottom: 100px;
  margin-top: 40px;
}
.divider:after, .divider:before {
    background-color: #bbbbbb;
}
</style>
