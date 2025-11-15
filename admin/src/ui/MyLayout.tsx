import { Layout } from 'react-admin';
import MyAppBar from './MyAppBar';
import MyMenu from './MyMenu';

export default function MyLayout(props: any) {
  return (
    <Layout {...props} appBar={MyAppBar as any} menu={MyMenu as any} />
  );
}

