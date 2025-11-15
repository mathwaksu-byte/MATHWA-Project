import { Menu, MenuItemLink } from 'react-admin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import ImageIcon from '@mui/icons-material/Image';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

export default function MyMenu() {
  return (
    <Menu>
      <MenuItemLink to="/" primaryText="Dashboard" leftIcon={<DashboardIcon />} />
      <MenuItemLink to="/universities" primaryText="Universities" leftIcon={<SchoolIcon />} />
      <MenuItemLink to="/university-fees" primaryText="Fees Editor" leftIcon={<CurrencyExchangeIcon />} />
      <MenuItemLink to="/university-gallery" primaryText="Gallery Uploader" leftIcon={<ImageIcon />} />
      <MenuItemLink to="/university-dp" primaryText="Display Picture" leftIcon={<ImageIcon />} />
      <MenuItemLink to="/site-settings" primaryText="Site Settings" leftIcon={<SettingsIcon />} />
      <MenuItemLink to="/leads" primaryText="Leads" leftIcon={<ContactPhoneIcon />} />
    </Menu>
  );
}
