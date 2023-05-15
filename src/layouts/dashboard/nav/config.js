// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'tests',
    path: '/dashboard/test',
    icon: icon('ic_test'),
    hasChild: true,
    child: [
      {
        title: 'pending test',
        path: '/dashboard/pending-test',
        icon: <Iconify icon="mdi:paperclip" />,
      },
      {
        title: 'completed test',
        path: '/dashboard/completed-test',
        icon: <Iconify icon="ic:baseline-fact-check" />,
      },
    ],
  },
  // {
  //   title: 'test history',
  //   path: '/dashboard/test-history',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'settings',
  //   path: '/dashboard/settings',
  //   icon: icon('ic_settings'),
  // },
  // {
  //   title: 'plans and pricing',
  //   path: '/pricing',
  //   icon: icon('ic_settings'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
