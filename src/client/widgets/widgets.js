
import snackbar from './snackbar/snackbar';
import taskitem from './taskitem/taskitem';

const options = {
    snackbar,
    taskitem
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
