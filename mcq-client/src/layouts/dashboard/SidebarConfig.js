import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import awardFill from '@iconify/icons-eva/award-fill';
import bookOpenFill from '@iconify/icons-eva/book-open-fill';
import clipboardFill from "@iconify/icons-eva/clipboard-fill";
import {useTheme} from '@mui/material/styles';
const getIcon = (name,color) => <Icon icon={name} width={22} height={22} color={color}/>;

const SidebarConfig=()=>{
  const theme=useTheme();
  const config= [
    {
      title: 'dashboard',
      path: '/dashboard',
      icon: getIcon(pieChart2Fill,theme.palette.primary.light)
    },
    {
      title: 'user',
      path: '/user',
      icon: getIcon(peopleFill,theme.palette.secondary.light)
    },
    {
      title: 'student',
      path: '/student',
      icon: getIcon(awardFill,theme.palette.chart.red[0])
    },
    {
      title: 'exam',
      path: '/exam',
      icon: getIcon(clipboardFill,theme.palette.warning.light)
    },
    {
      title: 'course',
      path: '/Course',
      icon: getIcon(shoppingBagFill,theme.palette.grey[400])
    },    
    {
      title: 'subject',
      path: '/Subject',
      icon: getIcon(bookOpenFill,theme.palette.chart.green[0])//fileTextFill
    },
  ];
  return config;
}


export default SidebarConfig;
