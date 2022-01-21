import Vue from 'vue';
import Button from './Button.vue';

Button.install = (app: Vue.App<Element>) => {
  app.component(Button.name, Button);
};

export default Button;
