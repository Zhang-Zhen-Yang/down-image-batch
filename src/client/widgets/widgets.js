
import snackbar from './snackbar/snackbar';

const options = {
    snackbar,
};
options.install = (Vue) => {
    for (let component in options) {
        const componentInstaller = options[component];
        if (componentInstaller && component !== 'install') {
            Vue.use(componentInstaller);
        }
    }
};
export default options;
