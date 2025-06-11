import HomePage from '@/components/pages/HomePage';
import GroupsPage from '@/components/pages/GroupsPage';
import ExpensesPage from '@/components/pages/ExpensesPage';
import BalancesPage from '@/components/pages/BalancesPage';
import SettingsPage from '@/components/pages/SettingsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  groups: {
    id: 'groups',
    label: 'Groups',
    path: '/groups',
    icon: 'Users',
component: GroupsPage
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'Receipt',
component: ExpensesPage
  },
  balances: {
    id: 'balances',
    label: 'Balances',
    path: '/balances',
    icon: 'Scale',
component: BalancesPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);
export const tabRoutes = [routes.groups, routes.expenses, routes.balances, routes.settings];