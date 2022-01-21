import Vue from 'vue';
import Button from './Button';

const components = [
  Button,
];

function install(app: Vue.App<Element>) {
  components.forEach(component => {
    component.install(app);
  });
}

export default {
  Button,
  install,
};
