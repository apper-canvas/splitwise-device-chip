import Home from '../pages/Home';
import Groups from '../pages/Groups';
import Expenses from '../pages/Expenses';
import Balances from '../pages/Balances';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  groups: {
    id: 'groups',
    label: 'Groups',
    path: '/groups',
    icon: 'Users',
    component: Groups
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'Receipt',
    component: Expenses
  },
  balances: {
    id: 'balances',
    label: 'Balances',
    path: '/balances',
    icon: 'Scale',
    component: Balances
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);
export const tabRoutes = [routes.groups, routes.expenses, routes.balances, routes.settings];