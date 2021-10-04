export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/employers',
              },
              {
                path: '/employers',
                name: 'employers',
                icon: 'table',
                component: './Tables/Employers',
              },
              {
                path: '/Operations',
                name: 'Operations',
                icon: 'BranchesOutlined',
                routes: [
                  {
                    path: '/Operations/BNZ/',
                    name: 'Pull Transactions',
                    component: './Operations/BNZ/',
                  },
                ],
              },
              {
                path: '/Settings',
                name: 'settings',
                icon: 'setting',
                routes: [
                  {
                    path: '/settings/integrations/',
                    name: 'integrations',
                    icon: 'api',
                    routes: [
                      {
                        path: '/Settings/integrations/BNZ',
                        name: 'bnz',
                        icon: 'bank',
                        component: './Settings/Integrations/BNZ',
                      },
                    ],
                  },
                ],
              },
              {
                path: '/Employees',
                name: 'Employees',
                icon: 'table',
                component: './Tables/Employees',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
