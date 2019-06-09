export const navItems = [
  {
    name: 'Personal cloud',
    url: '/dashboard',
    icon: 'cui-cloud',
    children: [
      {
        name: 'Cloudify',
        url: './defaultCloudify',
        icon: 'cui-star'
      },
      {
        name: 'Favorite 2',
        url: './',
        icon: 'cui-star'
      },
      {
        name: 'Favorite 3',
        url: './',
        icon: 'cui-star'
      }
    ]
  },
  {
    name: 'Shared clouds',
    url: '/dashboard',
    icon: 'cui-share'
  },
  {
    name: 'Recently updated',
    url: '/dashboard',
    icon: 'cui-cloud-upload'
  },
  {
    name: 'Followed file',
    url: '/dashboard',
    icon : 'cui-file'
  },
  {
    name: 'Synchronized computer',
    url: '/dashboard',
    icon: 'cui-laptop'
  },
  {
    name: 'Bin',
    url: '/dashboard',
    icon: 'cui-trash'
  },
  {
    name: 'My user groups',
    url: '/dashboard',
    icon: 'cui-user'
  }
];
