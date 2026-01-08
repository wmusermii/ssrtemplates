import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  //Your customizations, see the following sections for examples
  components: {
    datatable: {
      bodyCell: {
        // ini yang akan jadi --p-datatable-body-cell-padding
        padding: '0.25rem 0.6rem !important',
      }
    },
    breadcrumb: {
      root: {
        padding: '0.1rem !important',
      },
    },
  }
});

export default MyPreset;
